import { createSlice } from "@reduxjs/toolkit";

import {
  fetchAnnouncements,
} from "./announcementThunk";

const initialState = {
  announcements: [],

  loading: false,

  error: null,

  success: false,

  lastFetchedAt: null,
};

const announcementSlice =
  createSlice({
    name: "studentAnnouncement",

    initialState,

    reducers: {
      clearAnnouncements(state) {
        state.announcements = [];
        state.error = null;
        state.success = false;
        state.lastFetchedAt = null;
      },

      clearAnnouncementError(state) {
        state.error = null;
      },

      clearAnnouncementSuccess(state) {
        state.success = false;
      },
    },

    extraReducers: (builder) => {
      builder

        // ==================================
        // FETCH ANNOUNCEMENTS
        // ==================================

        .addCase(
          fetchAnnouncements.pending,
          (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
          }
        )

        .addCase(
          fetchAnnouncements.fulfilled,
          (state, action) => {
            state.loading = false;

            const data =
              action.payload?.data;

            state.announcements =
              Array.isArray(
                data?.announcements
              )
                ? data.announcements
                : [];

            state.success = true;

            state.lastFetchedAt =
              Date.now();
          }
        )

        .addCase(
          fetchAnnouncements.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to fetch announcements.";

            state.success = false;
          }
        );
    },
  });

export const {
  clearAnnouncements,
  clearAnnouncementError,
  clearAnnouncementSuccess,
} =
  announcementSlice.actions;

export default announcementSlice.reducer;