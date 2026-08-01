import { createAsyncThunk } from "@reduxjs/toolkit";

import studentProfileService from "../../services/studentProfileService";

// ===============================
// Get Student Profile
// ===============================
export const fetchProfile = createAsyncThunk(
  "studentProfile/fetchProfile",
  async (_, thunkAPI) => {
    console.log("✅ fetchProfile thunk called");
    try {
    const data = await studentProfileService.getProfile();

    console.log("✅ Thunk Data:", data);

    return data;
    } catch (error) {
    console.error("❌ Thunk Error:", error);

    return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile."
    );
    }
  }
);

// ===============================
// Update Student Profile
// ===============================
export const updateProfile = createAsyncThunk(
  "studentProfile/updateProfile",
  async (profileData, thunkAPI) => {
    try {
      return await studentProfileService.updateProfile(profileData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile."
      );
    }
  }
);

// ===============================
// Upload Profile Photo
// ===============================
export const uploadProfilePhoto = createAsyncThunk(
  "studentProfile/uploadProfilePhoto",
  async (formData, thunkAPI) => {
    try {
      return await studentProfileService.uploadProfilePhoto(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to upload profile photo."
      );
    }
  }
);