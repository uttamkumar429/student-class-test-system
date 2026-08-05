import { createSlice } from "@reduxjs/toolkit";

import {
  fetchTests,
  fetchTestById,
  createTest,
  updateTest,
  deleteTest,
  publishTest,
} from "./testThunk";

const initialState = {
  tests: [],

  currentTest: null,

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },

  filters: {
    search: "",
    subject: "",
    status: "",
    sort: "newest",
  },

  loading: false,
  error: null,
  success: false,
};

const testSlice = createSlice({
  name: "adminTest",

  initialState,

  reducers: {
    setFilters(state, action) {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };

      state.pagination.page = 1;
    },

    setPage(state, action) {
      state.pagination.page = action.payload;
    },

    resetFilters(state) {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },

    clearCurrentTest(state) {
      state.currentTest = null;
    },

    clearError(state) {
      state.error = null;
    },

    clearSuccess(state) {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ============================
      // FETCH TESTS
      // ============================

      .addCase(fetchTests.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(fetchTests.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload.data;

        state.tests = data.tests || [];

        state.pagination = {
          page: data.page || 1,
          limit: data.limit || 10,
          total: data.total || 0,
          totalPages: data.totalPages || 1,
        };

        state.success = true;
      })

      .addCase(fetchTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============================
      // FETCH SINGLE TEST
      // ============================

      .addCase(fetchTestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchTestById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTest = action.payload.data;
      })

      .addCase(fetchTestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============================
      // CREATE TEST
      // ============================

      .addCase(createTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createTest.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(createTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============================
      // UPDATE TEST
      // ============================

      .addCase(updateTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateTest.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(updateTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============================
      // DELETE TEST
      // ============================

      .addCase(deleteTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteTest.fulfilled, (state, action) => {
        state.loading = false;

        state.tests = state.tests.filter(
          (test) => test._id !== action.payload
        );
      })

      .addCase(deleteTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============================
      // PUBLISH TEST
      // ============================

      .addCase(publishTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(publishTest.fulfilled, (state, action) => {
        state.loading = false;

        const snapshot = action.payload.data;

        const index = state.tests.findIndex(
          (test) => test._id === snapshot.testId
        );

        if (index !== -1) {
          state.tests[index].status = "published";
        }
      })

      .addCase(publishTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  setPage,
  resetFilters,
  clearCurrentTest,
  clearError,
  clearSuccess,
} = testSlice.actions;

export default testSlice.reducer;