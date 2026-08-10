import { createSlice } from "@reduxjs/toolkit";
import {
  fetchResult,
  fetchResultHistory,
} from "./resultThunk";

const initialState = {
  // Current Result
  result: null,

  // Result History
  resultHistory: [],

  // UI State
  loading: false,
  error: null,
};

const resultSlice = createSlice({
  name: "studentResult",
  initialState,

  reducers: {
  resetResult: (state) => {
    state.result = null;
    state.loading = false;
    state.error = null;
  },

  resetResultHistory: (state) => {
    state.resultHistory = [];
    state.loading = false;
    state.error = null;
  },
  },

  extraReducers: (builder) => {
    builder

      // ==========================
      // FETCH RESULT
      // ==========================
      .addCase(fetchResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchResult.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload.data;
      })

      .addCase(fetchResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================
      // FETCH RESULT HISTORY
      // ==========================
      .addCase(fetchResultHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchResultHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.resultHistory = action.payload.data;
      })

      .addCase(fetchResultHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetResult,
  resetResultHistory,
} = resultSlice.actions;

export default resultSlice.reducer;