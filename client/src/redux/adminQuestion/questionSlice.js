import { createSlice } from "@reduxjs/toolkit";

import {
  fetchQuestionMetadata,
  fetchQuestions,
  fetchQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  
} from "./questionThunk";

const initialState = {
  // Question List
  questions: [],

  // Selected Question
  currentQuestion: null,

  metadata: {
  subjects: [],
  chaptersBySubject: {},
},

  // Pagination
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },

  // Filters
filters: {
  search: "",
  subject: "",
  chapter: "",
  difficulty: "",
  sortBy: "createdAt",
  order: "desc",
},

  // UI
  loading: false,
  error: null,
  success: false,
};

const questionSlice = createSlice({
  name: "adminQuestion",

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

    clearCurrentQuestion(state) {
      state.currentQuestion = null;
    },
    clearError(state) {
      state.error = null;
    },

    clearSuccess(state) {
      state.success = false;
    }
  },

  extraReducers: (builder) => {
    builder
  // ============================
  // FETCH QUESTION METADATA
  // ============================

      .addCase(
        fetchQuestionMetadata.pending,
        (state) => {
          state.error = null;
        }
      )

      .addCase(
        fetchQuestionMetadata.fulfilled,
        (state, action) => {
          state.metadata = {
            subjects:
              action.payload.data?.subjects || [],

            chaptersBySubject:
              action.payload.data
                ?.chaptersBySubject || {},
          };
        }
      )

      .addCase(
        fetchQuestionMetadata.rejected,
        (state, action) => {
          state.error = action.payload;
        }
      )

      // ============================
      // FETCH QUESTIONS
      // ============================

    .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
        
    })

    .addCase(fetchQuestions.fulfilled, (state, action) => {
       state.loading = false;

    const data = action.payload.data;

      state.questions = data.questions || [];

    state.pagination = {
        page: data.page || 1,
        limit: data.limit || 10,
        total: data.total || 0,
        totalPages: data.totalPages || 1,
    };

    
    })

    .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
    })

      // ============================
      // FETCH QUESTION
      // ============================

      .addCase(fetchQuestionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchQuestionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuestion =
          action.payload.data;
      })

      .addCase(fetchQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============================
      // CREATE QUESTION
      // ============================

      .addCase(createQuestion.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
      })

      .addCase(createQuestion.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(createQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============================
      // UPDATE QUESTION
      // ============================

      .addCase(updateQuestion.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
      })

      .addCase(updateQuestion.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============================
      // DELETE QUESTION
      // ============================

      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.loading = false;

        state.questions = state.questions.filter(
          (question) =>
            question._id !== action.payload
        );
      })

      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  resetFilters,
  clearCurrentQuestion,
  clearError,
  clearSuccess,
  setPage,
} = questionSlice.actions;

export default questionSlice.reducer;