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
  completed: [],

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
      state.completed = action.payload.completed || [];
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