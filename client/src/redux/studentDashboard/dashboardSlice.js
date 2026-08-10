import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  student: null,

  stats: {
    availableExams: 0,
    activeExams: 0,
    completedExams: 0,
    averageScore: 0,
  },

  upcoming: [],
  active: [],
  recentResults: [],
  performance: [],

  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "studentDashboard",

  initialState,

  reducers: {
    fetchDashboardStart(state) {
      state.loading = true;
      state.error = null;
    },

    fetchDashboardSuccess(state, action) {
      state.loading = false;

      state.student = action.payload.student || null;

      state.stats = action.payload.stats || {
        availableExams: 0,
        activeExams: 0,
        completedExams: 0,
        averageScore: 0,
      };

      state.upcoming = action.payload.upcoming || [];
      state.active = action.payload.active || [];
      state.recentResults =
        action.payload.recentResults || [];
      state.performance =
        action.payload.performance || [];
    },

    fetchDashboardFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    clearDashboardError(state) {
      state.error = null;
    },
  },
});

export const {
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchDashboardFailure,
  clearDashboardError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;