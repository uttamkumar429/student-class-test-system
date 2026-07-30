import { createSlice } from "@reduxjs/toolkit";
import {
  startExam,
  resumeExam,
  saveAnswer,
  submitExam,
} from "./examThunk";
const initialState = {
  // Exam Details
  attemptId: null,
  testSnapshotId: null,
  title: "",
  subject: "",

  // Questions
  questions: [],

  // Navigation
  currentQuestionIndex: 0,

  // Student Progress
  selectedAnswers: {},
  visitedQuestions: {},
  reviewQuestions: {},

  // Timer
  remainingTime: 0,

  // Exam Status
  submitted: false,

  // UI State
  loading: false,
  error: null,
};
const hydrateExamState = (state, exam) => {
  state.attemptId = exam.attemptId;
  state.testSnapshotId = exam.testSnapshotId;
  state.title = exam.title;
  state.subject = exam.subject;
  state.questions = exam?.questions ?? [];

  state.selectedAnswers = exam.selectedAnswers || {};
  state.visitedQuestions = exam.visitedQuestions || {};
  state.reviewQuestions = exam.reviewQuestions || {};

  state.currentQuestionIndex = exam.currentQuestionIndex || 0;
  state.remainingTime = exam.remainingTime || 0;
};
const examSlice = createSlice({
  name: "studentExam",
  initialState,

  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },

    saveSelectedAnswer: (state, action) => {
      const { questionId, answer } = action.payload;

      state.selectedAnswers[questionId] = answer;
    },

    markVisited: (state, action) => {
      const questionId = action.payload;

      state.visitedQuestions[questionId] = true;
    },

    toggleReviewQuestion: (state, action) => {
      const questionId = action.payload;

      if (state.reviewQuestions[questionId]) {
        delete state.reviewQuestions[questionId];
      } else {
        state.reviewQuestions[questionId] = true;
      }
    },

    updateRemainingTime: (state, action) => {
      state.remainingTime = action.payload;
    },
    markSubmitted: (state) => {
      state.submitted = true;
    },

    resetExam: () => initialState,
  },
  extraReducers: (builder) => {
  builder
    .addCase(startExam.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(startExam.fulfilled, (state, action) => {
        state.loading = false;
        hydrateExamState(state, action.payload.data);
    })

    .addCase(startExam.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
   .addCase(resumeExam.pending, (state) => {
        state.loading = true;
        state.error = null;
        })

    .addCase(resumeExam.fulfilled, (state, action) => {
        state.loading = false;
        hydrateExamState(state, action.payload.data);
    })

    .addCase(resumeExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase(saveAnswer.rejected, (state, action) => {
    state.error = action.payload;
    })
    .addCase(submitExam.pending, (state) => {
        state.loading = true;
        state.error = null;
    })

    .addCase(submitExam.fulfilled, (state) => {
        state.loading = false;
        state.submitted = true;
    })

    .addCase(submitExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
}
});

export const {

  setCurrentQuestion,
  saveSelectedAnswer,
  markVisited,
  toggleReviewQuestion,
  updateRemainingTime,

  markSubmitted,
  resetExam,
} = examSlice.actions;

export default examSlice.reducer;