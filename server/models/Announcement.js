const mongoose = require("mongoose");

const announcementSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200,
      },

      description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
      },

      type: {
        type: String,
        enum: [
          "exam",
          "result",
          "warning",
          "info",
        ],
        default: "info",
        index: true,
      },

      isPublished: {
        type: Boolean,
        default: false,
        index: true,
      },

      publishedAt: {
        type: Date,
        default: null,
        index: true,
      },

      expiresAt: {
        type: Date,
        default: null,
        index: true,
      },

      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

announcementSchema.index({
  isPublished: 1,
  publishedAt: -1,
});

module.exports = mongoose.model(
  "Announcement",
  announcementSchema
);