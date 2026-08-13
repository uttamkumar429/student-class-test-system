import { createSlice } from "@reduxjs/toolkit";

import {
  fetchNotificationPreferences,
  updateNotificationPreferences,
} from "./notificationPreferenceThunk";

const initialState = {
  preferences: {
    examNotifications: true,
    resultNotifications: true,
    announcementNotifications: true,
  },

  loading: false,
  updating: false,
  error: null,
  success: false,
};

const notificationPreferenceSlice =
  createSlice({
    name: "studentNotificationPreference",

    initialState,

    reducers: {
      clearNotificationPreferenceError(
        state
      ) {
        state.error = null;
      },

      clearNotificationPreferenceSuccess(
        state
      ) {
        state.success = false;
      },
    },

    extraReducers: (builder) => {
      builder

        // ==================================
        // FETCH
        // ==================================

        .addCase(
          fetchNotificationPreferences.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchNotificationPreferences.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            const preferences =
              action.payload?.data;

            if (preferences) {
              state.preferences = {
                examNotifications:
                  Boolean(
                    preferences.examNotifications
                  ),

                resultNotifications:
                  Boolean(
                    preferences.resultNotifications
                  ),

                announcementNotifications:
                  Boolean(
                    preferences.announcementNotifications
                  ),
              };
            }
          }
        )

        .addCase(
          fetchNotificationPreferences.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to fetch notification preferences.";
          }
        )

        // ==================================
        // UPDATE
        // ==================================

        .addCase(
          updateNotificationPreferences.pending,
          (state) => {
            state.updating = true;
            state.error = null;
            state.success = false;
          }
        )

        .addCase(
          updateNotificationPreferences.fulfilled,
          (
            state,
            action
          ) => {
            state.updating = false;
            state.success = true;

            const preferences =
              action.payload?.data;

            if (preferences) {
              state.preferences = {
                examNotifications:
                  Boolean(
                    preferences.examNotifications
                  ),

                resultNotifications:
                  Boolean(
                    preferences.resultNotifications
                  ),

                announcementNotifications:
                  Boolean(
                    preferences.announcementNotifications
                  ),
              };
            }
          }
        )

        .addCase(
          updateNotificationPreferences.rejected,
          (
            state,
            action
          ) => {
            state.updating = false;

            state.error =
              action.payload ||
              "Failed to update notification preferences.";
          }
        );
    },
  });

export const {
  clearNotificationPreferenceError,
  clearNotificationPreferenceSuccess,
} =
  notificationPreferenceSlice.actions;

export default notificationPreferenceSlice.reducer;