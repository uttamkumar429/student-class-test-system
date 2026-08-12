import { createSlice } from "@reduxjs/toolkit";

import { fetchReview } from "./reviewThunk";

const initialState = {
  // Review Data
  review: null,

  // Navigation
  currentQuestionIndex: 0,

  // UI State
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "studentReview",

  initialState,

  reducers: {
    // ======================================
    // SET CURRENT QUESTION
    // ======================================

    setCurrentQuestion(state, action) {
      state.currentQuestionIndex =
        action.payload;
    },

    // ======================================
    // RESET REVIEW
    // ======================================

    resetReview() {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================================
      // FETCH REVIEW - PENDING
      // ======================================

      .addCase(
        fetchReview.pending,
        (state) => {
          state.loading = true;
          state.error = null;

          // Prevent stale navigation state
          state.currentQuestionIndex = 0;
          state.review = null;
        }
      )

      // ======================================
      // FETCH REVIEW - SUCCESS
      // ======================================

.addCase(
  fetchReview.fulfilled,
  (state, action) => {
    state.loading = false;
    state.error = null;

    state.review =
      action.payload.data;
  }
)
      // ======================================
      // FETCH REVIEW - FAILURE
      // ======================================

      .addCase(
        fetchReview.rejected,
        (state, action) => {
          state.loading = false;

          state.review = null;
          state.currentQuestionIndex = 0;

          state.error =
            action.payload ||
            "Failed to load review.";
        }
      );
  },
});

export const {
  setCurrentQuestion,
  resetReview,
} = reviewSlice.actions;

export default reviewSlice.reducer;