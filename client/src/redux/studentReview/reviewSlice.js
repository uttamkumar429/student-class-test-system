import { createSlice } from "@reduxjs/toolkit";
import { fetchReview } from "./reviewThunk";

const initialState = {
  review: null,

  currentQuestionIndex: 0,

  loading: false,

  error: null,
};

const reviewSlice = createSlice({
  name: "studentReview",

  initialState,

  reducers: {
    setCurrentQuestion(state, action) {
      state.currentQuestionIndex =
        action.payload;
    },

    resetReview() {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchReview.fulfilled,
        (state, action) => {
          state.loading = false;
          state.review = action.payload.data;
        }
      )

      .addCase(
        fetchReview.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  setCurrentQuestion,
  resetReview,
} = reviewSlice.actions;

export default reviewSlice.reducer;