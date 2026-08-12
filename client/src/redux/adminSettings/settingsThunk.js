import { createAsyncThunk } from "@reduxjs/toolkit";

import systemSettingService from "../../services/systemSettingService";

// ======================================
// FETCH SETTINGS
// ======================================

export const fetchSettings = createAsyncThunk(
  "adminSettings/fetchSettings",
  async (_, thunkAPI) => {
    try {
      return await systemSettingService.getSettings();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch settings."
      );
    }
  }
);

// ======================================
// UPDATE PASS PERCENTAGE
// ======================================

export const updatePassPercentage =
  createAsyncThunk(
    "adminSettings/updatePassPercentage",
    async (value, thunkAPI) => {
      try {
        return await systemSettingService.updatePassPercentage(
          value
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to update pass percentage."
        );
      }
    }
  );