// ==============================
// TEST LIST
// ==============================

export const selectTests = (state) =>
  state.adminTest.tests;

// ==============================
// CURRENT TEST
// ==============================

export const selectCurrentTest = (state) =>
  state.adminTest.currentTest;

// ==============================
// LOADING
// ==============================

export const selectTestLoading = (state) =>
  state.adminTest.loading;

// ==============================
// SUCCESS
// ==============================

export const selectTestSuccess = (state) =>
  state.adminTest.success;

// ==============================
// ERROR
// ==============================

export const selectTestError = (state) =>
  state.adminTest.error;

// ==============================
// PAGINATION
// ==============================

export const selectTestPagination = (state) =>
  state.adminTest.pagination;

// ==============================
// FILTERS
// ==============================

export const selectTestFilters = (state) =>
  state.adminTest.filters;