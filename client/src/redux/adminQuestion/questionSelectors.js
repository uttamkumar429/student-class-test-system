// ==============================
// QUESTION LIST
// ==============================

export const selectQuestions = (state) =>
  state.adminQuestion.questions;

// ==============================
// QUESTION METADATA
// ==============================

export const selectQuestionMetadata =
  (state) =>
    state.adminQuestion.metadata;

export const selectQuestionSubjects =
  (state) =>
    state.adminQuestion.metadata.subjects;

export const selectQuestionChaptersBySubject =
  (state) =>
    state.adminQuestion.metadata
      .chaptersBySubject;
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