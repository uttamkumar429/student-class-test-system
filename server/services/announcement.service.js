const Announcement = require("../models/Announcement");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");

const {
  createNotifications,
} = require("./notification.service");
// =====================================
// CREATE ANNOUNCEMENT
// =====================================

const createAnnouncement = async ({
  title,
  description,
  type = "info",
  isPublished = false,
  publishedAt = null,
  expiresAt = null,
  
  createdBy,
}) => {
  if (!createdBy) {
    throw new ApiError(
      401,
      "Creator is required."
    );
  }

  const normalizedTitle =
    title?.trim();

  const normalizedDescription =
    description?.trim();

  if (!normalizedTitle) {
    throw new ApiError(
      400,
      "Announcement title is required."
    );
  }

  if (!normalizedDescription) {
    throw new ApiError(
      400,
      "Announcement description is required."
    );
  }

  if (
    ![
      "exam",
      "result",
      "warning",
      "info",
    ].includes(type)
  ) {
    throw new ApiError(
      400,
      "Invalid announcement type."
    );
  }

  let finalPublishedAt =
    publishedAt;

  if (isPublished && !finalPublishedAt) {
    finalPublishedAt = new Date();
  }

  if (expiresAt) {
    const expiryDate =
      new Date(expiresAt);

    if (Number.isNaN(expiryDate.getTime())) {
      throw new ApiError(
        400,
        "Invalid expiry date."
      );
    }

    if (
      finalPublishedAt &&
      expiryDate <=
        new Date(finalPublishedAt)
    ) {
      throw new ApiError(
        400,
        "Expiry date must be greater than publication date."
      );
    }
  }

  return Announcement.create({
    title: normalizedTitle,
    description:
      normalizedDescription,
    type,
    isPublished,
    publishedAt:
      finalPublishedAt,
    expiresAt,
    createdBy,
  });
};

// =====================================
// GET PUBLISHED ANNOUNCEMENTS
// =====================================

const getPublishedAnnouncements =
  async (limit = 5) => {
    const normalizedLimit =
      Math.min(
        20,
        Math.max(
          1,
          Number(limit) || 5
        )
      );

    const now = new Date();

    return Announcement.find({
      isPublished: true,
      publishedAt: {
        $ne: null,
        $lte: now,
      },
      $or: [
        {
          expiresAt: null,
        },
        {
          expiresAt: {
            $gt: now,
          },
        },
      ],
    })
      .populate(
        "createdBy",
        "fullName email"
      )
      .sort({
        publishedAt: -1,
      })
      .limit(normalizedLimit)
      .lean();
  };

// =====================================
// GET ALL ANNOUNCEMENTS — ADMIN
// =====================================

const getAllAnnouncements =
  async ({
    page = 1,
    limit = 10,
    search = "",
    type = "",
    status = "",
  } = {}) => {
    const normalizedPage =
      Math.max(
        1,
        Number(page) || 1
      );

    const normalizedLimit =
      Math.min(
        100,
        Math.max(
          1,
          Number(limit) || 10
        )
      );

    const skip =
      (normalizedPage - 1) *
      normalizedLimit;

    const filter = {};

    // ---------------------------------
    // Search
    // ---------------------------------

    const normalizedSearch =
      search?.trim();

    if (normalizedSearch) {
      filter.$or = [
        {
          title: {
            $regex:
              normalizedSearch,
            $options: "i",
          },
        },
        {
          description: {
            $regex:
              normalizedSearch,
            $options: "i",
          },
        },
      ];
    }

    // ---------------------------------
    // Type
    // ---------------------------------

    if (type) {
      filter.type = type;
    }

    // ---------------------------------
    // Status
    // ---------------------------------

    if (status === "published") {
      filter.isPublished = true;
    }

    if (status === "draft") {
      filter.isPublished = false;
    }

    const [
      total,
      announcements,
    ] = await Promise.all([
      Announcement.countDocuments(
        filter
      ),

      Announcement.find(filter)
        .populate(
          "createdBy",
          "fullName email"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(normalizedLimit)
        .lean(),
    ]);

    return {
      announcements,
      total,
      page: normalizedPage,
      limit: normalizedLimit,
      totalPages: Math.ceil(
        total / normalizedLimit
      ),
    };
  };

// =====================================
// GET ANNOUNCEMENT BY ID
// =====================================

const getAnnouncementById =
  async (announcementId) => {
    if (
      !announcementId
    ) {
      throw new ApiError(
        400,
        "Announcement ID is required."
      );
    }

    const announcement =
      await Announcement.findById(
        announcementId
      )
        .populate(
          "createdBy",
          "fullName email"
        )
        .lean();

    if (!announcement) {
      throw new ApiError(
        404,
        "Announcement not found."
      );
    }

    return announcement;
  };

// =====================================
// UPDATE ANNOUNCEMENT
// =====================================

const updateAnnouncement =
  async (
    announcementId,
    updateData
  ) => {
    const {
      title,
      description,
      type,
      expiresAt,
    } = updateData;

    const announcement =
      await Announcement.findById(
        announcementId
      );

    if (!announcement) {
      throw new ApiError(
        404,
        "Announcement not found."
      );
    }

    if (title !== undefined) {
      const normalizedTitle =
        title.trim();

      if (!normalizedTitle) {
        throw new ApiError(
          400,
          "Announcement title is required."
        );
      }

      announcement.title =
        normalizedTitle;
    }

    if (
      description !== undefined
    ) {
      const normalizedDescription =
        description.trim();

      if (!normalizedDescription) {
        throw new ApiError(
          400,
          "Announcement description is required."
        );
      }

      announcement.description =
        normalizedDescription;
    }

    if (type !== undefined) {
      if (
        ![
          "exam",
          "result",
          "warning",
          "info",
        ].includes(type)
      ) {
        throw new ApiError(
          400,
          "Invalid announcement type."
        );
      }

      announcement.type =
        type;
    }

    if (
      expiresAt !== undefined
    ) {
      if (expiresAt === null) {
        announcement.expiresAt =
          null;
      } else {
        const expiryDate =
          new Date(expiresAt);

        if (
          Number.isNaN(
            expiryDate.getTime()
          )
        ) {
          throw new ApiError(
            400,
            "Invalid expiry date."
          );
        }

        if (
          announcement.publishedAt &&
          expiryDate <=
            announcement.publishedAt
        ) {
          throw new ApiError(
            400,
            "Expiry date must be greater than publication date."
          );
        }

        announcement.expiresAt =
          expiryDate;
      }
    }

    await announcement.save();

    return Announcement.findById(
      announcement._id
    )
      .populate(
        "createdBy",
        "fullName email"
      )
      .lean();
  };

// =====================================
// PUBLISH ANNOUNCEMENT
// =====================================

const publishAnnouncement =
  async (announcementId) => {
    const announcement =
      await Announcement.findById(
        announcementId
      );

    if (!announcement) {
      throw new ApiError(
        404,
        "Announcement not found."
      );
    }

    if (announcement.isPublished) {
      throw new ApiError(
        409,
        "Announcement is already published."
      );
    }

    const now = new Date();

    if (
      announcement.expiresAt &&
      announcement.expiresAt <= now
    ) {
      throw new ApiError(
        400,
        "Cannot publish an expired announcement."
      );
    }

    announcement.isPublished =
      true;

    announcement.publishedAt =
      now;

    await announcement.save();
    // =====================================
// CREATE STUDENT NOTIFICATIONS
// =====================================

const students = await User.find({
  role: "student",
  isBlocked: false,
})
  .select("_id")
  .lean();

const studentIds =
  students.map(
    (student) => student._id
  );

await createNotifications({
  studentIds,

  type:
    "ANNOUNCEMENT",

  title:
    announcement.title,

  message:
    announcement.description,

  relatedId:
    announcement._id,

  relatedModel:
    "Announcement",

  actionUrl:
    "/student/dashboard",

  expiresAt:
    announcement.expiresAt,
});

    return Announcement.findById(
      announcement._id
    )
      .populate(
        "createdBy",
        "fullName email"
      )
      .lean();
  };

// =====================================
// UNPUBLISH ANNOUNCEMENT
// =====================================

const unpublishAnnouncement =
  async (announcementId) => {
    const announcement =
      await Announcement.findById(
        announcementId
      );

    if (!announcement) {
      throw new ApiError(
        404,
        "Announcement not found."
      );
    }

    if (!announcement.isPublished) {
      throw new ApiError(
        409,
        "Announcement is already a draft."
      );
    }

    announcement.isPublished =
      false;

    announcement.publishedAt =
      null;

    await announcement.save();

    return Announcement.findById(
      announcement._id
    )
      .populate(
        "createdBy",
        "fullName email"
      )
      .lean();
  };

// =====================================
// DELETE ANNOUNCEMENT
// =====================================

const deleteAnnouncement =
  async (announcementId) => {
    const announcement =
      await Announcement.findById(
        announcementId
      );

    if (!announcement) {
      throw new ApiError(
        404,
        "Announcement not found."
      );
    }

    await Announcement.deleteOne({
      _id: announcementId,
    });

    return {
      deletedId: announcementId,
    };
  };

module.exports = {
  createAnnouncement,
  getPublishedAnnouncements,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  publishAnnouncement,
  unpublishAnnouncement,
  deleteAnnouncement,
};