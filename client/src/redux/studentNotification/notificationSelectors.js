export const selectNotifications =
  (state) =>
    state.studentNotification
      .notifications;

export const selectNotificationPagination =
  (state) =>
    state.studentNotification
      .pagination;

export const selectNotificationUnreadCount =
  (state) =>
    state.studentNotification
      .unreadCount;

export const selectNotificationLoading =
  (state) =>
    state.studentNotification
      .loading;

export const selectNotificationUnreadCountLoading =
  (state) =>
    state.studentNotification
      .unreadCountLoading;

export const selectNotificationUpdating =
  (state) =>
    state.studentNotification
      .updating;

export const selectNotificationError =
  (state) =>
    state.studentNotification
      .error;

export const selectNotificationUnreadCountError =
  (state) =>
    state.studentNotification
      .unreadCountError;