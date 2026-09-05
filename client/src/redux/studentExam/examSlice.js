import { createSlice } from "@reduxjs/toolkit";

import {
  fetchAvailableExams,
  startExam,
  resumeExam,
  saveAnswer,
  updateExamProgress,
  submitExam,
  fetchExamQuestions,
} from "./examThunk";

// ======================================
// INITIAL STATE
// ======================================

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

  // Exam Lists
  availableExams: [],
  activeExams: [],
  completedExams: [],

  // UI State
  loading: false,
  error: null,

  progressSaving: false,
  progressError: null,
};

// ======================================
// RESET STATE HELPER
// ======================================

const getInitialState = () => ({
  ...initialState,

  selectedAnswers: {},
  visitedQuestions: {},
  reviewQuestions: {},

  availableExams: [],
  activeExams: [],
  completedExams: [],
});

// ======================================
// HYDRATE EXAM STATE
// ======================================

const normalizeQuestionMap = (value) => {
  if (!Array.isArray(value)) {
    return value || {};
  }

  return value.reduce((map, questionId) => {
    if (questionId) {
      map[questionId.toString()] = true;
    }

    return map;
  }, {});
};

const hydrateExamState = (state, exam) => {
  state.attemptId = exam.attemptId;

  state.testSnapshotId =
    exam.testSnapshotId;

  state.title =
    exam.title || "";

  state.subject =
    exam.subject || "";

  state.questions =
    Array.isArray(exam.questions)
      ? exam.questions
      : [];

  state.selectedAnswers =
    exam.selectedAnswers &&
    typeof exam.selectedAnswers === "object"
      ? exam.selectedAnswers
      : {};

  state.visitedQuestions =
    normalizeQuestionMap(
      exam.visitedQuestions
    );

  state.reviewQuestions =
    normalizeQuestionMap(
      exam.reviewQuestions
    );

  state.currentQuestionIndex =
    Number.isInteger(
      exam.currentQuestionIndex
    )
      ? exam.currentQuestionIndex
      : 0;

  state.remainingTime =
    Number(exam.remainingTime) || 0;
};

// ======================================
// SLICE
// ======================================

const examSlice = createSlice({
  name: "studentExam",

  initialState,

  reducers: {
    // ==================================
    // CURRENT QUESTION
    // ==================================

    setCurrentQuestion: (
      state,
      action
    ) => {
      const index = action.payload;

      if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= state.questions.length
      ) {
        return;
      }

      state.currentQuestionIndex =
        index;
    },

    // ==================================
    // SAVE SELECTED ANSWER - UI STATE
    // ==================================

    saveSelectedAnswer: (
      state,
      action
    ) => {
      const {
        questionId,
        answer,
      } = action.payload;

      if (!questionId) {
        return;
      }

      // Unselect answer
      if (answer === null) {
        delete state.selectedAnswers[
          questionId
        ];

        return;
      }

      // Validate selected answer
      if (
        !["A", "B", "C", "D"].includes(
          answer
        )
      ) {
        return;
      }

      // Save selected answer
      state.selectedAnswers[
        questionId
      ] = answer;
    },

    // ==================================
    // CLEAR SELECTED ANSWER
    // ==================================

    clearSelectedAnswer: (
      state,
      action
    ) => {
      const { questionId } =
        action.payload;

      if (!questionId) {
        return;
      }

      delete state.selectedAnswers[
        questionId
      ];
    },

    // ==================================
    // MARK VISITED
    // ==================================

    markVisited: (
      state,
      action
    ) => {
      const questionId =
        action.payload;

      if (!questionId) {
        return;
      }

      state.visitedQuestions[
        questionId
      ] = true;
    },

    // ==================================
    // TOGGLE REVIEW
    // ==================================

    toggleReviewQuestion: (
      state,
      action
    ) => {
      const questionId =
        action.payload;

      if (!questionId) {
        return;
      }

      if (
        state.reviewQuestions[
          questionId
        ]
      ) {
        delete state.reviewQuestions[
          questionId
        ];
      } else {
        state.reviewQuestions[
          questionId
        ] = true;
      }
    },

    // ==================================
    // UPDATE TIMER
    // ==================================

    updateRemainingTime: (
      state,
      action
    ) => {
      const remainingTime =
        Number(action.payload);

      if (
        !Number.isFinite(
          remainingTime
        )
      ) {
        return;
      }

      state.remainingTime =
        Math.max(
          Math.floor(
            remainingTime
          ),
          0
        );
    },

    // ==================================
    // MARK SUBMITTED
    // ==================================

    markSubmitted: (
      state
    ) => {
      state.submitted = true;
    },

    // ==================================
    // RESET EXAM
    // ==================================

    resetExam: () =>
      getInitialState(),
  },

  // ====================================
  // ASYNC THUNKS
  // ====================================

  extraReducers: (
    builder
  ) => {
    builder

      // ==================================
      // FETCH AVAILABLE EXAMS
      // ==================================

      .addCase(
        fetchAvailableExams.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchAvailableExams.fulfilled,
        (
          state,
          action
        ) => {
          state.loading = false;

          state.availableExams =
            action.payload?.data
              ?.exams ?? [];
        }
      )

      .addCase(
        fetchAvailableExams.rejected,
        (
          state,
          action
        ) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch exams.";
        }
      )

      // ==================================
      // FETCH EXAM QUESTIONS
      // ==================================

      .addCase(
        fetchExamQuestions.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchExamQuestions.fulfilled,
        (
          state,
          action
        ) => {
          state.loading = false;

          const exam =
            action.payload?.data;

          hydrateExamState(
            state,
            exam
          );
        }
      )

      .addCase(
        fetchExamQuestions.rejected,
        (
          state,
          action
        ) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch exam.";
        }
      )

      // ==================================
      // START EXAM
      // ==================================

      .addCase(
        startExam.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        startExam.fulfilled,
        (
          state,
          action
        ) => {
          state.loading = false;

          const exam =
            action.payload?.data;

          if (!exam) {
            return;
          }

          state.attemptId =
            exam.attemptId ??
            exam._id ??
            null;

          state.testSnapshotId =
            exam.testSnapshotId ??
            exam.testSnapshot ??
            null;

          state.title =
            exam.title ??
            "";

          state.subject =
            exam.subject ??
            "";

          state.currentQuestionIndex =
            Number.isInteger(
              exam.currentQuestionIndex
            )
              ? exam.currentQuestionIndex
              : 0;

          state.remainingTime =
            Number(exam.remainingTime) || 0;

          state.submitted = false;
        }
      )

      .addCase(
        startExam.rejected,
        (
          state,
          action
        ) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to start exam.";
        }
      )

      // ==================================
      // RESUME EXAM
      // ==================================

      .addCase(
        resumeExam.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        resumeExam.fulfilled,
        (
          state,
          action
        ) => {
          state.loading = false;

          const exam =
            action.payload?.data;

          hydrateExamState(
            state,
            exam
          );
        }
      )

      .addCase(
        resumeExam.rejected,
        (
          state,
          action
        ) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to resume exam.";
        }
      )

      // ==================================
      // SAVE ANSWER
      // ==================================

      .addCase(
        saveAnswer.pending,
        (state) => {
          /*
           * Do not set global loading=true
           * here.
           *
           * Saving an answer is a background
           * operation and should not replace
           * the entire exam UI with a loader.
           */

          state.error = null;
        }
      )

      .addCase(
        saveAnswer.fulfilled,
        () => {
          /*
           * UI answer is already updated
           * optimistically by
           * saveSelectedAnswer().
           */
        }
      )

      .addCase(
        saveAnswer.rejected,
        (
          state,
          action
        ) => {
          state.error =
            action.payload ||
            "Failed to save answer.";
        }
      )

      // ======================================
      // UPDATE EXAM PROGRESS
      // ======================================

      .addCase(
        updateExamProgress.pending,
        (state) => {
          state.progressSaving = true;
        }
      )

      .addCase(
        updateExamProgress.fulfilled,
        (
          state,
          action
        ) => {
          state.progressSaving = false;

          const progress =
            action.payload?.data;

          if (!progress) {
            return;
          }

          /*
           * IMPORTANT:
           *
           * The browser/UI is the source of truth
           * for currentQuestionIndex while the
           * student is actively navigating.
           *
           * A delayed server response must NOT
           * move the student back to an older
           * question.
           *
           * currentQuestionIndex is still persisted
           * by the backend and is restored through
           * fetchExamQuestions() after refresh.
           */

          state.visitedQuestions =
            normalizeQuestionMap(
              progress.visitedQuestions
            );

          state.reviewQuestions =
            normalizeQuestionMap(
              progress.reviewQuestions
            );
        }
      )

      .addCase(
        updateExamProgress.rejected,
        (
          state,
          action
        ) => {
          state.progressSaving = false;

          state.progressError =
            action.payload ||
            "Failed to update exam progress.";
        }
      )

      // ==================================
      // SUBMIT EXAM
      // ==================================

      .addCase(
        submitExam.pending,
        (state) => {
          state.error = null;
        }
      )

      .addCase(
        submitExam.fulfilled,
        (
          state
        ) => {
          state.loading = false;
          state.submitted = true;
        }
      )

      .addCase(
        submitExam.rejected,
        (
          state,
          action
        ) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to submit exam.";
        }
      );
  },
});

// ======================================
// ACTIONS
// ======================================

export const {
  setCurrentQuestion,
  saveSelectedAnswer,
  clearSelectedAnswer,
  markVisited,
  toggleReviewQuestion,
  updateRemainingTime,
  markSubmitted,
  resetExam,
} = examSlice.actions;

// ======================================
// REDUCER
// ======================================

export default examSlice.reducer;