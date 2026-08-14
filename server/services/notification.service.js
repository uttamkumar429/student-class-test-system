const Notification = require("../models/Notification");
const User = require("../models/User");

const NotificationPreference = require(
  "../models/NotificationPreference"
);

const ApiError = require(
  "../utils/ApiError"
);

// =====================================
// NOTIFICATION TYPE → PREFERENCE MAP
// =====================================

const PREFERENCE_MAP = {
  EXAM: "examNotifications",
  RESULT: "resultNotifications",
  ANNOUNCEMENT:
    "announcementNotifications",
};

// =====================================
// VALIDATE STUDENT
// =====================================

const validateStudent = async (
  studentId
) => {
  if (!studentId) {
    throw new ApiError(
      401,
      "Student authentication is required."
    );
  }

  const student =
    await User.findById(studentId)
      .select("_id role isBlocked")
      .lean();

  if (!student) {
    throw new ApiError(
      404,
      "Student account not found."
    );
  }

  if (student.role !== "student") {
    throw new ApiError(
      403,
      "Only students can receive student notifications."
    );
  }

  if (student.isBlocked) {
    throw new ApiError(
      403,
      "Your account is blocked."
    );
  }

  return student;
};

// =====================================
// CHECK NOTIFICATION PREFERENCE
// =====================================

const isNotificationAllowed =
  async (
    studentId,
    type
  ) => {
    const preferenceField =
      PREFERENCE_MAP[type];

    // SYSTEM notifications are always allowed.
    if (!preferenceField) {
      return true;
    }

    const preferences =
      await NotificationPreference.findOne({
        student: studentId,
      })
        .select(preferenceField)
        .lean();

    // No preference document means
    // default preference = enabled.
    if (!preferences) {
      return true;
    }

    return (
      preferences[preferenceField] !== false
    );
  };

// =====================================
// CREATE SINGLE NOTIFICATION
// =====================================

const createNotification =
  async ({
    studentId,
    type,
    title,
    message,
    relatedId = null,
    relatedModel = null,
    actionUrl = null,
    expiresAt = null,
    dedupeKey = null,
  }) => {
    // ---------------------------------
    // Validate student
    // ---------------------------------

    await validateStudent(
      studentId
    );

    // ---------------------------------
    // Validate type
    // ---------------------------------

    const allowedTypes = [
      "EXAM",
      "RESULT",
      "ANNOUNCEMENT",
      "SYSTEM",
    ];

    if (
      !allowedTypes.includes(type)
    ) {
      throw new ApiError(
        400,
        "Invalid notification type."
      );
    }

    // ---------------------------------
    // Validate title
    // ---------------------------------

    if (
      typeof title !== "string" ||
      title.trim() === ""
    ) {
      throw new ApiError(
        400,
        "Notification title is required."
      );
    }

    // ---------------------------------
    // Validate message
    // ---------------------------------

    if (
      typeof message !== "string" ||
      message.trim() === ""
    ) {
      throw new ApiError(
        400,
        "Notification message is required."
      );
    }

    // ---------------------------------
    // Check student preference
    // ---------------------------------

    const allowed =
      await isNotificationAllowed(
        studentId,
        type
      );

    if (!allowed) {
      return null;
    }

    // ---------------------------------
    // BUILD STABLE DEDUPE KEY
    // ---------------------------------

    let finalDedupeKey =
      dedupeKey;

    if (
      !finalDedupeKey &&
      relatedId &&
      relatedModel
    ) {
      finalDedupeKey =
        `${type}:${relatedModel}:${relatedId}`;
    }

    // ---------------------------------
    // BUILD NOTIFICATION DATA
    // ---------------------------------

    const notificationData = {
      student: studentId,
      type,
      title: title.trim(),
      message: message.trim(),
      relatedId,
      relatedModel,
      actionUrl,
      expiresAt,
    };

    if (finalDedupeKey) {
      notificationData.dedupeKey =
        finalDedupeKey;
    }

    // ---------------------------------
    // CREATE WITHOUT DEDUPE
    // ---------------------------------

    if (!finalDedupeKey) {
      return Notification.create(
        notificationData
      );
    }

    // ---------------------------------
    // IDEMPOTENT CREATE
    // ---------------------------------

    const notification =
      await Notification.findOneAndUpdate(
        {
          student: studentId,
          dedupeKey:
            finalDedupeKey,
        },
        {
          $setOnInsert:
            notificationData,
        },
        {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
        }
      ).lean();

    return notification;
  };

// =====================================
// CREATE NOTIFICATIONS FOR MANY STUDENTS
// =====================================

const createNotifications =
  async ({
    studentIds,
    type,
    title,
    message,
    relatedId = null,
    relatedModel = null,
    actionUrl = null,
    expiresAt = null,
    dedupeKey = null,
  }) => {
    if (
      !Array.isArray(studentIds) ||
      studentIds.length === 0
    ) {
      return [];
    }

    // ---------------------------------
    // Remove duplicate student IDs
    // ---------------------------------

    const uniqueStudentIds = [
      ...new Set(
        studentIds.map((id) =>
          id.toString()
        )
      ),
    ];

    const notifications = [];

    // ---------------------------------
    // Create notifications
    // ---------------------------------

    for (
      const studentId
      of uniqueStudentIds
    ) {
      const notification =
        await createNotification({
          studentId,
          type,
          title,
          message,
          relatedId,
          relatedModel,
          actionUrl,
          expiresAt,
          dedupeKey,
        });

      if (notification) {
        notifications.push(
          notification
        );
      }
    }

    return notifications;
  };

// =====================================
// GET STUDENT NOTIFICATIONS
// =====================================

const getStudentNotifications =
  async (
    studentId,
    {
      page = 1,
      limit = 10,
      unreadOnly = false,
    } = {}
  ) => {
    await validateStudent(
      studentId
    );

    // ---------------------------------
    // Safe pagination
    // ---------------------------------

    const safePage = Math.max(
      1,
      Number(page) || 1
    );

    const safeLimit = Math.min(
      50,
      Math.max(
        1,
        Number(limit) || 10
      )
    );

    const skip =
      (safePage - 1) *
      safeLimit;

    // ---------------------------------
    // Base query
    // ---------------------------------

    const query = {
      student: studentId,

      $or: [
        {
          expiresAt: null,
        },

        {
          expiresAt: {
            $gt: new Date(),
          },
        },
      ],
    };

    // ---------------------------------
    // Unread filter
    // ---------------------------------

    if (unreadOnly === true) {
      query.isRead = false;
    }

    // ---------------------------------
    // Parallel queries
    // ---------------------------------

    const [
      notifications,
      total,
    ] = await Promise.all([
      Notification.find(query)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(safeLimit)
        .lean(),

      Notification.countDocuments(
        query
      ),
    ]);

    return {
      notifications,

      pagination: {
        page: safePage,
        limit: safeLimit,
        total,

        totalPages:
          Math.ceil(
            total / safeLimit
          ),
      },
    };
  };

// =====================================
// GET UNREAD COUNT
// =====================================

const getUnreadCount =
  async (studentId) => {
    await validateStudent(
      studentId
    );

    return Notification.countDocuments({
      student: studentId,

      isRead: false,

      $or: [
        {
          expiresAt: null,
        },

        {
          expiresAt: {
            $gt: new Date(),
          },
        },
      ],
    });
  };

// =====================================
// MARK ONE AS READ
// =====================================

const markNotificationAsRead =
  async (
    studentId,
    notificationId
  ) => {
    await validateStudent(
      studentId
    );

    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: notificationId,

          // Ownership protection
          student: studentId,
        },

        {
          $set: {
            isRead: true,
          },
        },

        {
        returnDocument: "after",
        }
      ).lean();

    if (!notification) {
      throw new ApiError(
        404,
        "Notification not found."
      );
    }

    return notification;
  };

// =====================================
// MARK ALL AS READ
// =====================================

const markAllNotificationsAsRead =
  async (studentId) => {
    await validateStudent(
      studentId
    );

    const result =
      await Notification.updateMany(
        {
          student: studentId,

          isRead: false,
        },

        {
          $set: {
            isRead: true,
          },
        }
      );

    return {
      modifiedCount:
        result.modifiedCount,
    };
  };

// =====================================
// EXPORTS
// =====================================

module.exports = {
  createNotification,
  createNotifications,
  getStudentNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};