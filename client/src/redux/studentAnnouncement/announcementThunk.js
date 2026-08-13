import { createAsyncThunk } from "@reduxjs/toolkit";

import announcementService from "../../services/announcementService";

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
// FETCH PUBLISHED ANNOUNCEMENTS
// ======================================

export const fetchAnnouncements =
  createAsyncThunk(
    "studentAnnouncement/fetchAnnouncements",

    async (
      limit = 5,
      { rejectWithValue }
    ) => {
      try {
        return await announcementService.getPublishedAnnouncements(
          limit
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to fetch announcements."
          )
        );
      }
    }
  );