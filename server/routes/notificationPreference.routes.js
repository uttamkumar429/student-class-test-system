const express = require("express");

const router = express.Router();

const {
  protect,
} = require("../middleware/auth.middleware");

const authorize =
  require("../middleware/role.middleware");

const controller =
  require(
    "../controllers/notificationPreference.controller"
  );

// ======================================
// GET NOTIFICATION PREFERENCES
// GET /api/student/settings/notifications
// ======================================

router.get(
  "/notifications",
  protect,
  authorize("student"),
  controller.getNotificationPreferences
);

// ======================================
// UPDATE NOTIFICATION PREFERENCES
// PUT /api/student/settings/notifications
// ======================================

router.put(
  "/notifications",
  protect,
  authorize("student"),
  controller.updateNotificationPreferences
);

module.exports = router;