const asyncHandler = require("../middleware/asyncHandler");

const {
  successResponse,
} = require("../utils/response");

const {
  getNotificationPreferences:
    getNotificationPreferencesService,

  updateNotificationPreferences:
    updateNotificationPreferencesService,
} = require("../services/notificationPreference.service");

// ======================================
// GET NOTIFICATION PREFERENCES
// ======================================

exports.getNotificationPreferences =
  asyncHandler(async (req, res) => {
    const preferences =
      await getNotificationPreferencesService(
        req.user._id
      );

    return successResponse(
      res,
      200,
      "Notification preferences fetched successfully.",
      preferences
    );
  });

// ======================================
// UPDATE NOTIFICATION PREFERENCES
// ======================================

exports.updateNotificationPreferences =
  asyncHandler(async (req, res) => {
    const preferences =
      await updateNotificationPreferencesService(
        req.user._id,
        req.body
      );

    return successResponse(
      res,
      200,
      "Notification preferences updated successfully.",
      preferences
    );
  });