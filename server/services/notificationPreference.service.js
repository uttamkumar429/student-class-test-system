const NotificationPreference = require(
  "../models/NotificationPreference"
);

const User = require("../models/User");

const ApiError = require(
  "../utils/ApiError"
);

// =====================================
// DEFAULT PREFERENCES
// =====================================

const DEFAULT_PREFERENCES = {
  examNotifications: true,
  resultNotifications: true,
  announcementNotifications: true,
};

// =====================================
// VALIDATE STUDENT
// =====================================

const validateStudent = async (studentId) => {
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
      "Only students can manage notification preferences."
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
// GET NOTIFICATION PREFERENCES
// =====================================

const getNotificationPreferences =
  async (studentId) => {
    await validateStudent(studentId);

    const preference =
      await NotificationPreference.findOne({
        student: studentId,
      })
        .select(
          "student examNotifications resultNotifications announcementNotifications createdAt updatedAt"
        )
        .lean();

    if (!preference) {
      return {
        student: studentId,
        ...DEFAULT_PREFERENCES,
        createdAt: null,
        updatedAt: null,
      };
    }

    return preference;
  };

// =====================================
// UPDATE NOTIFICATION PREFERENCES
// =====================================

const updateNotificationPreferences =
  async (
    studentId,
    updates
  ) => {
    await validateStudent(studentId);

    if (
      !updates ||
      typeof updates !== "object" ||
      Array.isArray(updates)
    ) {
      throw new ApiError(
        400,
        "Notification preferences must be an object."
      );
    }

    const allowedFields = [
      "examNotifications",
      "resultNotifications",
      "announcementNotifications",
    ];

    const updatePayload = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        if (
          typeof updates[field] !== "boolean"
        ) {
          throw new ApiError(
            400,
            `${field} must be a boolean value.`
          );
        }

        updatePayload[field] =
          updates[field];
      }
    }

    if (
      Object.keys(updatePayload).length === 0
    ) {
      throw new ApiError(
        400,
        "At least one notification preference must be provided."
      );
    }

    // ---------------------------------
    // Find existing preferences
    // ---------------------------------

    const existingPreference =
      await NotificationPreference.findOne({
        student: studentId,
      });

    // ---------------------------------
    // Create new preference document
    // ---------------------------------

    if (!existingPreference) {
      const newPreference =
        await NotificationPreference.create({
          student: studentId,

          examNotifications:
            updatePayload.examNotifications ??
            DEFAULT_PREFERENCES.examNotifications,

          resultNotifications:
            updatePayload.resultNotifications ??
            DEFAULT_PREFERENCES.resultNotifications,

          announcementNotifications:
            updatePayload.announcementNotifications ??
            DEFAULT_PREFERENCES.announcementNotifications,
        });

      return NotificationPreference.findById(
        newPreference._id
      )
        .select(
          "student examNotifications resultNotifications announcementNotifications createdAt updatedAt"
        )
        .lean();
    }

    // ---------------------------------
    // Update existing preferences
    // ---------------------------------

    Object.assign(
      existingPreference,
      updatePayload
    );

    await existingPreference.save();

    return NotificationPreference.findById(
      existingPreference._id
    )
      .select(
        "student examNotifications resultNotifications announcementNotifications createdAt updatedAt"
      )
      .lean();
  };
module.exports = {
  DEFAULT_PREFERENCES,
  getNotificationPreferences,
  updateNotificationPreferences,
};