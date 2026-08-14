import { createAsyncThunk } from "@reduxjs/toolkit";

import notificationService from "../../services/notificationService";

// ======================================
// ERROR MESSAGE HELPER
// ======================================

const getErrorMessage = (
  error,
  fallbackMessage
) => {
  const message =
    error?.response?.data?.message ||
    error?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return (
    message ||
    fallbackMessage
  );
};

// ======================================
// FETCH NOTIFICATIONS
// ======================================

export const fetchNotifications =
  createAsyncThunk(
    "studentNotification/fetchNotifications",

    async (
      {
        page = 1,
        limit = 10,
        unreadOnly = false,
      } = {},
      { rejectWithValue }
    ) => {
      try {
        return await notificationService.getNotifications({
          page,
          limit,
          unreadOnly,
        });
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to fetch notifications."
          )
        );
      }
    }
  );

// ======================================
// FETCH UNREAD COUNT
// ======================================

export const fetchUnreadCount =
  createAsyncThunk(
    "studentNotification/fetchUnreadCount",

    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        return await notificationService.getUnreadCount();
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to fetch unread notification count."
          )
        );
      }
    }
  );

// ======================================
// MARK ONE AS READ
// ======================================

export const markNotificationAsRead =
  createAsyncThunk(
    "studentNotification/markAsRead",

    async (
      notificationId,
      { rejectWithValue }
    ) => {
      if (!notificationId) {
        return rejectWithValue(
          "Notification ID is required."
        );
      }

      try {
        return await notificationService.markAsRead(
          notificationId
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to mark notification as read."
          )
        );
      }
    }
  );

// ======================================
// MARK ALL AS READ
// ======================================

export const markAllNotificationsAsRead =
  createAsyncThunk(
    "studentNotification/markAllAsRead",

    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        return await notificationService.markAllAsRead();
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to mark notifications as read."
          )
        );
      }
    }
  );