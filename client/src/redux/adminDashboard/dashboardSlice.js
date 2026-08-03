import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboard } from "./dashboardThunk";

const initialState = {
  dashboard: null,

  loading: false,

  error: null,
};

const dashboardSlice = createSlice({
  name: "adminDashboard",

  initialState,

  reducers: {
    resetDashboard: (state) => {
      state.dashboard = null;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ============================
      // FETCH DASHBOARD
      // ============================

      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload.data;
      })

      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;