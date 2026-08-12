import { createAsyncThunk } from "@reduxjs/toolkit";

import studentExamService from "../../services/studentExamService";

// ======================================
// ERROR MESSAGE HELPER
// ======================================

const getErrorMessage = (
  error,
  fallbackMessage
) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage
  );
};

// ======================================
// FETCH AVAILABLE EXAMS
// ======================================

export const fetchAvailableExams =
  createAsyncThunk(
    "studentExam/fetchAvailableExams",

    async (_, { rejectWithValue }) => {
      try {
        return await studentExamService.getAvailableExams();
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to fetch exams."
          )
        );
      }
    }
  );

// ======================================
// START EXAM
// ======================================

export const startExam =
  createAsyncThunk(
    "studentExam/startExam",

    async (
      snapshotId,
      { rejectWithValue }
    ) => {
      if (!snapshotId) {
        return rejectWithValue(
          "Exam ID is required."
        );
      }

      try {
        return await studentExamService.startExam(
          snapshotId
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to start exam."
          )
        );
      }
    }
  );

// ======================================
// RESUME EXAM
// ======================================

export const resumeExam =
  createAsyncThunk(
    "studentExam/resumeExam",

    async (_, { rejectWithValue }) => {
      try {
        return await studentExamService.resumeExam();
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to resume exam."
          )
        );
      }
    }
  );

// ======================================
// SAVE ANSWER
// ======================================

export const saveAnswer =
  createAsyncThunk(
    "studentExam/saveAnswer",

    async (
      { attemptId, payload },
      { rejectWithValue }
    ) => {
      if (!attemptId) {
        return rejectWithValue(
          "Exam attempt ID is required."
        );
      }

      if (
        !payload ||
        !payload.questionId ||
        (
          payload.selectedAnswer !== null &&
          payload.selectedAnswer !== undefined &&
          !["A", "B", "C", "D"].includes(
            payload.selectedAnswer
          )
        )
      ) {
        return rejectWithValue(
          "Question and selected answer are required."
        );
      }

      try {
        return await studentExamService.saveAnswer(
          attemptId,
          payload
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to save answer."
          )
        );
      }
    }
  );

  // ======================================
// UPDATE EXAM PROGRESS
// ======================================

export const updateExamProgress =
  createAsyncThunk(
    "studentExam/updateExamProgress",

    async (
      {
        attemptId,
        currentQuestionIndex,
        visitedQuestions,
        reviewQuestions,
      },
      { rejectWithValue }
    ) => {
      if (!attemptId) {
        return rejectWithValue(
          "Exam attempt ID is required."
        );
      }

      if (
        !Number.isInteger(
          currentQuestionIndex
        )
      ) {
        return rejectWithValue(
          "Invalid current question index."
        );
      }

      try {
        return await studentExamService.updateExamProgress(
          attemptId,
          {
            currentQuestionIndex,
            visitedQuestions,
            reviewQuestions,
          }
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to update exam progress."
          )
        );
      }
    }
  );
// ======================================
// SUBMIT EXAM
// ======================================

export const submitExam =
  createAsyncThunk(
    "studentExam/submitExam",

    async (
      attemptId,
      { rejectWithValue }
    ) => {
      if (!attemptId) {
        return rejectWithValue(
          "Exam attempt ID is required."
        );
      }

      try {
        return await studentExamService.submitExam(
          attemptId
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to submit exam."
          )
        );
      }
    }
  );

// ======================================
// FETCH EXAM QUESTIONS
// ======================================

export const fetchExamQuestions =
  createAsyncThunk(
    "studentExam/fetchExamQuestions",

    async (
      attemptId,
      { rejectWithValue }
    ) => {
      if (!attemptId) {
        return rejectWithValue(
          "Exam attempt ID is required."
        );
      }

      try {
        return await studentExamService.getExamQuestions(
          attemptId
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to fetch exam."
          )
        );
      }
    }
  );