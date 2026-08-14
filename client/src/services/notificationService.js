import api from "./api";

class NotificationService {
  // ======================================
  // GET NOTIFICATIONS
  // ======================================

  async getNotifications({
    page = 1,
    limit = 10,
    unreadOnly = false,
  } = {}) {
    const { data } = await api.get(
      "/student/notifications",
      {
        params: {
          page,
          limit,
          unreadOnly,
        },
      }
    );

    return data;
  }

  // ======================================
  // GET UNREAD COUNT
  // ======================================

  async getUnreadCount() {
    const { data } = await api.get(
      "/student/notifications/unread-count"
    );

    return data;
  }

  // ======================================
  // MARK ONE AS READ
  // ======================================

  async markAsRead(
    notificationId
  ) {
    if (!notificationId) {
      throw new Error(
        "Notification ID is required."
      );
    }

    const { data } = await api.patch(
      `/student/notifications/${notificationId}/read`
    );

    return data;
  }

  // ======================================
  // MARK ALL AS READ
  // ======================================

  async markAllAsRead() {
    const { data } = await api.patch(
      "/student/notifications/read-all"
    );

    return data;
  }
}

const notificationService =
  new NotificationService();

export default notificationService;