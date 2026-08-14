const express = require("express");

const router = express.Router();

const {
  protect,
} = require("../middleware/auth.middleware");

const authorize =
  require("../middleware/role.middleware");

const controller =
  require("../controllers/notification.controller");

// ======================================
// GET STUDENT NOTIFICATIONS
// GET /api/student/notifications
// ======================================

router.get(
  "/",
  protect,
  authorize("student"),
  controller.getStudentNotifications
);

// ======================================
// GET UNREAD COUNT
// GET /api/student/notifications/unread-count
// ======================================

router.get(
  "/unread-count",
  protect,
  authorize("student"),
  controller.getUnreadCount
);

// ======================================
// MARK ONE AS READ
// PATCH /api/student/notifications/:id/read
// ======================================

router.patch(
  "/:id/read",
  protect,
  authorize("student"),
  controller.markNotificationAsRead
);

// ======================================
// MARK ALL AS READ
// PATCH /api/student/notifications/read-all
// ======================================

router.patch(
  "/read-all",
  protect,
  authorize("student"),
  controller.markAllNotificationsAsRead
);

module.exports = router;