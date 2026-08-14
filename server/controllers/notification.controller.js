const asyncHandler = require("../middleware/asyncHandler");

const {
  successResponse,
} = require("../utils/response");

const {
  getStudentNotifications:
    getStudentNotificationsService,

  getUnreadCount:
    getUnreadCountService,

  markNotificationAsRead:
    markNotificationAsReadService,

  markAllNotificationsAsRead:
    markAllNotificationsAsReadService,
} = require("../services/notification.service");

// ======================================
// GET STUDENT NOTIFICATIONS
// ======================================

exports.getStudentNotifications =
  asyncHandler(async (req, res) => {
    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const unreadOnly =
      req.query.unreadOnly === "true";

    const result =
      await getStudentNotificationsService(
        req.user._id,
        {
          page,
          limit,
          unreadOnly,
        }
      );

    return successResponse(
      res,
      200,
      "Notifications fetched successfully.",
      result
    );
  });

// ======================================
// GET UNREAD COUNT
// ======================================

exports.getUnreadCount =
  asyncHandler(async (req, res) => {
    const count =
      await getUnreadCountService(
        req.user._id
      );

    return successResponse(
      res,
      200,
      "Unread notification count fetched successfully.",
      {
        count,
      }
    );
  });

// ======================================
// MARK ONE NOTIFICATION AS READ
// ======================================

exports.markNotificationAsRead =
  asyncHandler(async (req, res) => {
    const notification =
      await markNotificationAsReadService(
        req.user._id,
        req.params.id
      );

    return successResponse(
      res,
      200,
      "Notification marked as read.",
      notification
    );
  });

// ======================================
// MARK ALL NOTIFICATIONS AS READ
// ======================================

exports.markAllNotificationsAsRead =
  asyncHandler(async (req, res) => {
    const result =
      await markAllNotificationsAsReadService(
        req.user._id
      );

    return successResponse(
      res,
      200,
      "All notifications marked as read.",
      result
    );
  });