import { createSlice } from "@reduxjs/toolkit";

import {
  fetchAnnouncements,
  fetchAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  publishAnnouncement,
  unpublishAnnouncement,
  deleteAnnouncement,
} from "./announcementThunk";

// ======================================
// INITIAL STATE
// ======================================

const initialState = {
  announcements: [],

  currentAnnouncement: null,

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },

  filters: {
    search: "",
    type: "",
    status: "",
  },

  loading: false,

  error: null,

  success: false,
};

const announcementSlice =
  createSlice({
    name: "adminAnnouncement",

    initialState,

    reducers: {
      // ==================================
      // SET FILTERS
      // ==================================

      setFilters(
        state,
        action
      ) {
        state.filters = {
          ...state.filters,
          ...action.payload,
        };

        state.pagination.page = 1;
      },

      // ==================================
      // SET PAGE
      // ==================================

      setPage(
        state,
        action
      ) {
        state.pagination.page =
          Math.max(
            1,
            Number(action.payload) || 1
          );
      },

      // ==================================
      // RESET FILTERS
      // ==================================

      resetFilters(state) {
        state.filters = {
          ...initialState.filters,
        };

        state.pagination.page = 1;
      },

      // ==================================
      // CLEAR CURRENT
      // ==================================

      clearCurrentAnnouncement(
        state
      ) {
        state.currentAnnouncement =
          null;
      },

      // ==================================
      // CLEAR ERROR
      // ==================================

      clearError(state) {
        state.error = null;
      },

      // ==================================
      // CLEAR SUCCESS
      // ==================================

      clearSuccess(state) {
        state.success = false;
      },
    },

    extraReducers: (builder) => {
      builder

        // ==================================
        // FETCH ALL
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
          (
            state,
            action
          ) => {
            state.loading = false;

            const data =
              action.payload?.data;

            state.announcements =
              Array.isArray(
                data?.announcements
              )
                ? data.announcements
                : [];

            state.pagination = {
              page:
                Number(data?.page) || 1,

              limit:
                Number(data?.limit) || 10,

              total:
                Number(data?.total) || 0,

              totalPages:
                Number(
                  data?.totalPages
                ) || 1,
            };

            state.success = true;
          }
        )

        .addCase(
          fetchAnnouncements.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to fetch announcements.";
          }
        )

        // ==================================
        // FETCH SINGLE
        // ==================================

        .addCase(
          fetchAnnouncementById.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchAnnouncementById.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.currentAnnouncement =
              action.payload?.data ||
              null;
          }
        )

        .addCase(
          fetchAnnouncementById.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to fetch announcement.";
          }
        )

        // ==================================
        // CREATE
        // ==================================

        .addCase(
          createAnnouncement.pending,
          (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
          }
        )

        .addCase(
          createAnnouncement.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.success = true;

            const announcement =
              action.payload?.data;

            if (announcement) {
              state.announcements.unshift(
                announcement
              );

              state.pagination.total += 1;
            }
          }
        )

        .addCase(
          createAnnouncement.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to create announcement.";
          }
        )

        // ==================================
        // UPDATE
        // ==================================

        .addCase(
          updateAnnouncement.pending,
          (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
          }
        )

        .addCase(
          updateAnnouncement.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.success = true;

            const updated =
              action.payload?.data;

            if (!updated) {
              return;
            }

            const index =
              state.announcements.findIndex(
                (item) =>
                  item._id ===
                  updated._id
              );

            if (index !== -1) {
              state.announcements[
                index
              ] = updated;
            }

            if (
              state.currentAnnouncement
                ?._id === updated._id
            ) {
              state.currentAnnouncement =
                updated;
            }
          }
        )

        .addCase(
          updateAnnouncement.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to update announcement.";
          }
        )

        // ==================================
        // PUBLISH
        // ==================================

        .addCase(
          publishAnnouncement.pending,
          (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
          }
        )

        .addCase(
          publishAnnouncement.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.success = true;

            const updated =
              action.payload?.data;

            if (!updated) {
              return;
            }

            const index =
              state.announcements.findIndex(
                (item) =>
                  item._id ===
                  updated._id
              );

            if (index !== -1) {
              state.announcements[
                index
              ] = updated;
            }

            if (
              state.currentAnnouncement
                ?._id === updated._id
            ) {
              state.currentAnnouncement =
                updated;
            }
          }
        )

        .addCase(
          publishAnnouncement.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to publish announcement.";
          }
        )

        // ==================================
        // UNPUBLISH
        // ==================================

        .addCase(
          unpublishAnnouncement.pending,
          (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
          }
        )

        .addCase(
          unpublishAnnouncement.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.success = true;

            const updated =
              action.payload?.data;

            if (!updated) {
              return;
            }

            const index =
              state.announcements.findIndex(
                (item) =>
                  item._id ===
                  updated._id
              );

            if (index !== -1) {
              state.announcements[
                index
              ] = updated;
            }

            if (
              state.currentAnnouncement
                ?._id === updated._id
            ) {
              state.currentAnnouncement =
                updated;
            }
          }
        )

        .addCase(
          unpublishAnnouncement.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to unpublish announcement.";
          }
        )

        // ==================================
        // DELETE
        // ==================================

        .addCase(
          deleteAnnouncement.pending,
          (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
          }
        )

        .addCase(
          deleteAnnouncement.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.success = true;

            state.announcements =
              state.announcements.filter(
                (item) =>
                  item._id !==
                  action.payload
              );

            state.pagination.total =
              Math.max(
                0,
                state.pagination.total - 1
              );

            if (
              state.currentAnnouncement
                ?._id ===
              action.payload
            ) {
              state.currentAnnouncement =
                null;
            }
          }
        )

        .addCase(
          deleteAnnouncement.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to delete announcement.";
          }
        );
    },
  });

export const {
  setFilters,
  setPage,
  resetFilters,
  clearCurrentAnnouncement,
  clearError,
  clearSuccess,
} =
  announcementSlice.actions;

export default announcementSlice.reducer;