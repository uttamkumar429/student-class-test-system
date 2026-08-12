// ==============================================
// Root Selector
// ==============================================

export const selectExamState = (state) =>
  state.studentExam;

// ==============================================
// Exam Details
// ==============================================

export const selectAttemptId = (state) =>
  state.studentExam.attemptId;

export const selectQuestions = (state) =>
  state.studentExam.questions;

export const selectCurrentQuestionIndex = (state) =>
  state.studentExam.currentQuestionIndex;

export const selectCurrentQuestion = (state) => {
  const exam = state.studentExam;

  return (
    exam.questions[exam.currentQuestionIndex] ||
    null
  );
};

// ==============================================
// Student Progress
// ==============================================

export const selectSelectedAnswers = (state) =>
  state.studentExam.selectedAnswers;

export const selectVisitedQuestions = (state) =>
  state.studentExam.visitedQuestions;

export const selectReviewQuestions = (state) =>
  state.studentExam.reviewQuestions;

// ==============================================
// Timer
// ==============================================

export const selectRemainingTime = (state) =>
  state.studentExam.remainingTime;

// ==============================================
// UI
// ==============================================

export const selectLoading = (state) =>
  state.studentExam.loading;

export const selectError = (state) =>
  state.studentExam.error;

export const selectSubmitted = (state) =>
  state.studentExam.submitted;
// ==============================================
// Available Exams
// ==============================================

export const selectAvailableExams = (state) =>
  state.studentExam.availableExams || [];

// ==============================================
// Dashboard Exams (Future)
// ==============================================

export const selectActiveExams = (state) =>
  state.studentExam.activeExams || [];

export const selectCompletedExams = (state) =>
  state.studentExam.completedExams || [];

// ==============================================
// UI
// ==============================================

export const selectExamLoading = (state) =>
  state.studentExam.loading;

export const selectExamError = (state) =>
  state.studentExam.error;
// ======================================
// EXAM PROGRESS SELECTORS
// ======================================

export const selectProgressSaving = (
  state
) =>
  state.studentExam.progressSaving;

export const selectProgressError = (
  state
) =>
  state.studentExam.progressError;