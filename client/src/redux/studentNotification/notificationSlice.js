import { createSlice } from "@reduxjs/toolkit";

import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./notificationThunk";

const initialState = {
  notifications: [],

  unreadCount: 0,

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  loading: false,

  unreadCountLoading: false,

  updating: false,

  error: null,

  unreadCountError: null,
};

const notificationSlice =
  createSlice({
    name: "studentNotification",

    initialState,

    reducers: {
      clearNotificationError(
        state
      ) {
        state.error = null;
      },

      clearUnreadCountError(
        state
      ) {
        state.unreadCountError =
          null;
      },
    },

    extraReducers: (builder) => {
      builder

        // ==================================
        // FETCH NOTIFICATIONS
        // ==================================

        .addCase(
          fetchNotifications.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchNotifications.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            const data =
              action.payload?.data;

            if (!data) {
              return;
            }

            state.notifications =
              Array.isArray(
                data.notifications
              )
                ? data.notifications
                : [];

            state.pagination = {
              page:
                Number(
                  data.pagination?.page
                ) || 1,

              limit:
                Number(
                  data.pagination?.limit
                ) || 10,

              total:
                Number(
                  data.pagination?.total
                ) || 0,

              totalPages:
                Number(
                  data.pagination?.totalPages
                ) || 0,
            };
          }
        )

        .addCase(
          fetchNotifications.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to fetch notifications.";
          }
        )

        // ==================================
        // FETCH UNREAD COUNT
        // ==================================

        .addCase(
          fetchUnreadCount.pending,
          (state) => {
            state.unreadCountLoading =
              true;

            state.unreadCountError =
              null;
          }
        )

        .addCase(
          fetchUnreadCount.fulfilled,
          (
            state,
            action
          ) => {
            state.unreadCountLoading =
              false;

            state.unreadCount =
              Number(
                action.payload?.data
                  ?.count
              ) || 0;
          }
        )

        .addCase(
          fetchUnreadCount.rejected,
          (
            state,
            action
          ) => {
            state.unreadCountLoading =
              false;

            state.unreadCountError =
              action.payload ||
              "Failed to fetch unread notification count.";
          }
        )

        // ==================================
        // MARK ONE AS READ
        // ==================================

        .addCase(
          markNotificationAsRead.pending,
          (state) => {
            state.updating = true;
            state.error = null;
          }
        )

        .addCase(
          markNotificationAsRead.fulfilled,
          (
            state,
            action
          ) => {
            state.updating = false;

            const updated =
              action.payload?.data;

            if (!updated?._id) {
              return;
            }

            const index =
              state.notifications.findIndex(
                (notification) =>
                  notification._id ===
                  updated._id
              );

            if (index !== -1) {
              state.notifications[
                index
              ] = {
                ...state.notifications[
                  index
                ],
                ...updated,
                isRead: true,
              };
            }

            state.unreadCount =
              Math.max(
                0,
                state.unreadCount - 1
              );
          }
        )

        .addCase(
          markNotificationAsRead.rejected,
          (
            state,
            action
          ) => {
            state.updating = false;

            state.error =
              action.payload ||
              "Failed to mark notification as read.";
          }
        )

        // ==================================
        // MARK ALL AS READ
        // ==================================

        .addCase(
          markAllNotificationsAsRead.pending,
          (state) => {
            state.updating = true;
            state.error = null;
          }
        )

        .addCase(
          markAllNotificationsAsRead.fulfilled,
          (state) => {
            state.updating = false;

            state.notifications =
              state.notifications.map(
                (
                  notification
                ) => ({
                  ...notification,
                  isRead: true,
                })
              );

            state.unreadCount = 0;
          }
        )

        .addCase(
          markAllNotificationsAsRead.rejected,
          (
            state,
            action
          ) => {
            state.updating = false;

            state.error =
              action.payload ||
              "Failed to mark notifications as read.";
          }
        );
    },
  });

export const {
  clearNotificationError,
  clearUnreadCountError,
} =
  notificationSlice.actions;

export default notificationSlice.reducer;