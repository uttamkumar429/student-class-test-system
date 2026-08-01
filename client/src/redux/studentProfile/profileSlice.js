import { createSlice } from "@reduxjs/toolkit";

import {
  fetchProfile,
  updateProfile,
  uploadProfilePhoto,
} from "./profileThunk";

const initialState = {
  profile: null,

  loadingProfile: false,
  loadingUpdate: false,
  loadingPhotoUpload: false,

  success: false,
  error: null,
};

const profileSlice = createSlice({
  name: "studentProfile",

  initialState,

  reducers: {
    clearProfileError(state) {
      state.error = null;
    },

    resetProfileSuccess(state) {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ===============================
      // Fetch Profile
      // ===============================

      .addCase(fetchProfile.pending, (state) => {
        state.loadingProfile = true;
        state.error = null;
      })

        .addCase(fetchProfile.fulfilled, (state, action) => {

        console.log(action.payload);

        state.loadingProfile = false;
        state.profile = action.payload;
        })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loadingProfile = false;
        state.error = action.payload;
      })

      // ===============================
      // Update Profile
      // ===============================

      .addCase(updateProfile.pending, (state) => {
        state.loadingUpdate = true;
        state.error = null;
        state.success = false;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        state.profile = action.payload;
        state.success = true;
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.error = action.payload;
      })

      // ===============================
      // Upload Profile Photo
      // ===============================

      .addCase(uploadProfilePhoto.pending, (state) => {
        state.loadingPhotoUpload = true;
        state.error = null;
      })

      .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        state.loadingPhotoUpload = false;

        if (state.profile) {
          state.profile.profilePhoto = action.payload.profilePhoto;
        }

        state.success = true;
      })

      .addCase(uploadProfilePhoto.rejected, (state, action) => {
        state.loadingPhotoUpload = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearProfileError,
  resetProfileSuccess,
} = profileSlice.actions;

export default profileSlice.reducer;