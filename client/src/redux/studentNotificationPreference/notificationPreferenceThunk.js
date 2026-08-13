import { createAsyncThunk } from "@reduxjs/toolkit";

import notificationPreferenceService from "../../services/notificationPreferenceService";

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
// FETCH PREFERENCES
// ======================================

export const fetchNotificationPreferences =
  createAsyncThunk(
    "studentNotificationPreference/fetch",
    async (_, { rejectWithValue }) => {
      try {
        return await notificationPreferenceService.getPreferences();
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to fetch notification preferences."
          )
        );
      }
    }
  );

// ======================================
// UPDATE PREFERENCES
// ======================================

export const updateNotificationPreferences =
  createAsyncThunk(
    "studentNotificationPreference/update",
    async (
      preferences,
      { rejectWithValue }
    ) => {
      if (
        !preferences ||
        typeof preferences !== "object" ||
        Array.isArray(preferences)
      ) {
        return rejectWithValue(
          "Invalid notification preferences."
        );
      }

      try {
        return await notificationPreferenceService.updatePreferences(
          preferences
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to update notification preferences."
          )
        );
      }
    }
  );