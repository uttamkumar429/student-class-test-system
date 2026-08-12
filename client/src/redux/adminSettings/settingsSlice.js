import { createSlice } from "@reduxjs/toolkit";

import {
  fetchSettings,
  updatePassPercentage,
} from "./settingsThunk";

const initialState = {
  passPercentage: 33,

  loading: false,
  updating: false,

  error: null,
  updateError: null,

  updateSuccess: false,
};

const settingsSlice = createSlice({
  name: "adminSettings",

  initialState,

  reducers: {
    clearSettingsError(state) {
      state.error = null;
      state.updateError = null;
    },

    resetUpdateSuccess(state) {
      state.updateSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================================
      // FETCH SETTINGS
      // ======================================

      .addCase(
        fetchSettings.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchSettings.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          const passPercentage =
            Number(
              action.payload?.passPercentage
            );

          if (
            Number.isFinite(
              passPercentage
            )
          ) {
            state.passPercentage =
              passPercentage;
          }
        }
      )

      .addCase(
        fetchSettings.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch settings.";
        }
      )

      // ======================================
      // UPDATE PASS PERCENTAGE
      // ======================================

      .addCase(
        updatePassPercentage.pending,
        (state) => {
          state.updating = true;
          state.updateError = null;
          state.updateSuccess = false;
        }
      )

      .addCase(
        updatePassPercentage.fulfilled,
        (state, action) => {
          state.updating = false;
          state.updateError = null;
          state.updateSuccess = true;

          const value =
            Number(
              action.payload?.value
            );

          if (Number.isFinite(value)) {
            state.passPercentage = value;
          }
        }
      )

      .addCase(
        updatePassPercentage.rejected,
        (state, action) => {
          state.updating = false;
          state.updateSuccess = false;

          state.updateError =
            action.payload ||
            "Failed to update pass percentage.";
        }
      );
  },
});

export const {
  clearSettingsError,
  resetUpdateSuccess,
} = settingsSlice.actions;

export default settingsSlice.reducer;