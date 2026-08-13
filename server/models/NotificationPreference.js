const mongoose = require("mongoose");

const notificationPreferenceSchema =
  new mongoose.Schema(
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true,
      },

      examNotifications: {
        type: Boolean,
        default: true,
      },

      resultNotifications: {
        type: Boolean,
        default: true,
      },

      announcementNotifications: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "NotificationPreference",
    notificationPreferenceSchema
  );