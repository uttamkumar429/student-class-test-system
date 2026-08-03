// ==============================
// QUESTION LIST
// ==============================

export const selectQuestions = (state) =>
  state.adminQuestion.questions;

// ==============================
// CURRENT QUESTION
// ==============================

export const selectCurrentQuestion = (state) =>
  state.adminQuestion.currentQuestion;

// ==============================
// LOADING
// ==============================

export const selectQuestionLoading = (state) =>
  state.adminQuestion.loading;

// success
export const selectQuestionSuccess = (state) =>
  state.adminQuestion.success;

// ==============================
// ERROR
// ==============================

export const selectQuestionError = (state) =>
  state.adminQuestion.error;

// ==============================
// PAGINATION
// ==============================

export const selectQuestionPagination = (state) =>
  state.adminQuestion.pagination;

// ==============================
// FILTERS
// ==============================

export const selectQuestionFilters = (state) =>
  state.adminQuestion.filters;