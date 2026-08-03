// Root

export const selectDashboardState = (state) =>
  state.adminDashboard;

// Data

export const selectDashboard = (state) =>
  state.adminDashboard.dashboard;

// Loading

export const selectDashboardLoading = (state) =>
  state.adminDashboard.loading;

// Error

export const selectDashboardError = (state) =>
  state.adminDashboard.error;

// Individual Cards

export const selectTotalStudents = (state) =>
  state.adminDashboard.dashboard?.totalStudents ?? 0;

export const selectActiveStudents = (state) =>
  state.adminDashboard.dashboard?.activeStudents ?? 0;

export const selectBlockedStudents = (state) =>
  state.adminDashboard.dashboard?.blockedStudents ?? 0;

export const selectTeachers = (state) =>
  state.adminDashboard.dashboard?.totalTeachers ?? 0;

export const selectQuestions = (state) =>
  state.adminDashboard.dashboard?.totalQuestions ?? 0;

export const selectPublishedTests = (state) =>
  state.adminDashboard.dashboard?.publishedTests ?? 0;

export const selectDraftTests = (state) =>
  state.adminDashboard.dashboard?.draftTests ?? 0;

export const selectCompletedTests = (state) =>
  state.adminDashboard.dashboard?.completedTests ?? 0;

export const selectTodayAttempts = (state) =>
  state.adminDashboard.dashboard?.todayAttempts ?? 0;

export const selectTotalAttempts = (state) =>
  state.adminDashboard.dashboard?.totalAttempts ?? 0;