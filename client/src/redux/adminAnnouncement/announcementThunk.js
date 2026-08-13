import { createAsyncThunk } from "@reduxjs/toolkit";

import adminAnnouncementService from "../../services/adminAnnouncementService";

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
// FETCH ALL ANNOUNCEMENTS
// ======================================

export const fetchAnnouncements =
  createAsyncThunk(
    "adminAnnouncement/fetchAnnouncements",

    async (
      params = {},
      { rejectWithValue }
    ) => {
      try {
        return await adminAnnouncementService.getAnnouncements(
          params
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

// ======================================
// FETCH SINGLE ANNOUNCEMENT
// ======================================

export const fetchAnnouncementById =
  createAsyncThunk(
    "adminAnnouncement/fetchAnnouncementById",

    async (
      announcementId,
      { rejectWithValue }
    ) => {
      if (!announcementId) {
        return rejectWithValue(
          "Announcement ID is required."
        );
      }

      try {
        return await adminAnnouncementService.getAnnouncementById(
          announcementId
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to fetch announcement."
          )
        );
      }
    }
  );

// ======================================
// CREATE ANNOUNCEMENT
// ======================================

export const createAnnouncement =
  createAsyncThunk(
    "adminAnnouncement/createAnnouncement",

    async (
      announcementData,
      { rejectWithValue }
    ) => {
      if (!announcementData) {
        return rejectWithValue(
          "Announcement data is required."
        );
      }

      try {
        return await adminAnnouncementService.createAnnouncement(
          announcementData
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to create announcement."
          )
        );
      }
    }
  );

// ======================================
// UPDATE ANNOUNCEMENT
// ======================================

export const updateAnnouncement =
  createAsyncThunk(
    "adminAnnouncement/updateAnnouncement",

    async (
      {
        announcementId,
        announcementData,
      },
      { rejectWithValue }
    ) => {
      if (!announcementId) {
        return rejectWithValue(
          "Announcement ID is required."
        );
      }

      if (!announcementData) {
        return rejectWithValue(
          "Announcement data is required."
        );
      }

      try {
        return await adminAnnouncementService.updateAnnouncement(
          announcementId,
          announcementData
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to update announcement."
          )
        );
      }
    }
  );

// ======================================
// PUBLISH ANNOUNCEMENT
// ======================================

export const publishAnnouncement =
  createAsyncThunk(
    "adminAnnouncement/publishAnnouncement",

    async (
      announcementId,
      { rejectWithValue }
    ) => {
      if (!announcementId) {
        return rejectWithValue(
          "Announcement ID is required."
        );
      }

      try {
        return await adminAnnouncementService.publishAnnouncement(
          announcementId
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to publish announcement."
          )
        );
      }
    }
  );

// ======================================
// UNPUBLISH ANNOUNCEMENT
// ======================================

export const unpublishAnnouncement =
  createAsyncThunk(
    "adminAnnouncement/unpublishAnnouncement",

    async (
      announcementId,
      { rejectWithValue }
    ) => {
      if (!announcementId) {
        return rejectWithValue(
          "Announcement ID is required."
        );
      }

      try {
        return await adminAnnouncementService.unpublishAnnouncement(
          announcementId
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to unpublish announcement."
          )
        );
      }
    }
  );

// ======================================
// DELETE ANNOUNCEMENT
// ======================================

export const deleteAnnouncement =
  createAsyncThunk(
    "adminAnnouncement/deleteAnnouncement",

    async (
      announcementId,
      { rejectWithValue }
    ) => {
      if (!announcementId) {
        return rejectWithValue(
          "Announcement ID is required."
        );
      }

      try {
        await adminAnnouncementService.deleteAnnouncement(
          announcementId
        );

        return announcementId;
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to delete announcement."
          )
        );
      }
    }
  );