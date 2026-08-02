export const selectReviewState = (state) =>
  state.studentReview;

export const selectReview = (state) =>
  state.studentReview.review;

export const selectLoading = (state) =>
  state.studentReview.loading;

export const selectError = (state) =>
  state.studentReview.error;

export const selectCurrentQuestionIndex = (
  state
) => state.studentReview.currentQuestionIndex;

export const selectQuestions = (state) =>
  state.studentReview.review?.questions || [];

export const selectCurrentQuestion = (state) => {
  const review = state.studentReview.review;

  if (!review) return null;

  return (
    review.questions[
      state.studentReview.currentQuestionIndex
    ] || null
  );
};