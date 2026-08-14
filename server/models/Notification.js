const mongoose = require("mongoose");

// =====================================
// NOTIFICATION SCHEMA
// =====================================

const notificationSchema =
  new mongoose.Schema(
    {
      // =================================
      // RECIPIENT
      // =================================

      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      // =================================
      // NOTIFICATION TYPE
      // =================================

      type: {
        type: String,
        enum: [
          "EXAM",
          "RESULT",
          "ANNOUNCEMENT",
          "SYSTEM",
        ],
        required: true,
        index: true,
      },

      // =================================
      // TITLE
      // =================================

      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },

      // =================================
      // MESSAGE
      // =================================

      message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
      },

      // =================================
      // READ STATUS
      // =================================

      isRead: {
        type: Boolean,
        default: false,
        index: true,
      },

      // =================================
      // OPTIONAL RELATED RESOURCE
      // =================================

      relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },

      relatedModel: {
        type: String,
        enum: [
          "TestSnapshot",
          "ExamAttempt",
          "Announcement",
          null,
        ],
        default: null,
      },

      
        // =====================================
        // IDEMPOTENCY / DEDUPLICATION KEY
        // =====================================

        dedupeKey: {
        type: String,
        trim: true,
        maxlength: 300,
        },

      // =================================
      // OPTIONAL ACTION URL
      // =================================

      actionUrl: {
        type: String,
        trim: true,
        maxlength: 500,
        default: null,
      },

      // =================================
      // EXPIRY
      // =================================

      expiresAt: {
        type: Date,
        default: null,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

// =====================================
// INDEXES
// =====================================

// Latest notifications for a student
notificationSchema.index({
  student: 1,
  createdAt: -1,
});

// =====================================
// PREVENT DUPLICATE EVENT NOTIFICATIONS
// =====================================
notificationSchema.index(
  {
    student: 1,
    dedupeKey: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      dedupeKey: {
        $type: "string",
      },
    },
  }
);

// Unread notifications for a student
notificationSchema.index({
  student: 1,
  isRead: 1,
  createdAt: -1,
});

module.exports =
  mongoose.model(
    "Notification",
    notificationSchema
  );