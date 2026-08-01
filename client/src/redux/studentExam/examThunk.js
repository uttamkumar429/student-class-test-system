import { createAsyncThunk } from "@reduxjs/toolkit";
import studentExamService from "../../services/studentExamService";

// ================================
// Fetch Available Exams
// ================================
export const fetchAvailableExams = createAsyncThunk(
  "studentExam/fetchAvailableExams",
  async (_, { rejectWithValue }) => {
    try {
      return await studentExamService.getAvailableExams();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch exams."
      );
    }
  }
);

// ================================
// Start Exam
// ================================
export const startExam = createAsyncThunk(
  "studentExam/startExam",
  async (snapshotId, { rejectWithValue }) => {
    try {
      return await studentExamService.startExam(snapshotId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to start exam."
      );
    }
  }
);

// ================================
// Resume Exam
// ================================
export const resumeExam = createAsyncThunk(
  "studentExam/resumeExam",
  async (_, { rejectWithValue }) => {
    try {
      return await studentExamService.resumeExam();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to resume exam."
      );
    }
  }
);

// ================================
// Save Answer
// ================================
export const saveAnswer = createAsyncThunk(
  "studentExam/saveAnswer",
  async ({ attemptId, payload }, { rejectWithValue }) => {
    try {
      return await studentExamService.saveAnswer(
        attemptId,
        payload
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to save answer."
      );
    }
  }
);

// ================================
// Submit Exam
// ================================
export const submitExam = createAsyncThunk(
  "studentExam/submitExam",
  async (attemptId, { rejectWithValue }) => {
    try {
      return await studentExamService.submitExam(attemptId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to submit exam."
      );
    }
  }
);
export const fetchExamQuestions = createAsyncThunk(
  "studentExam/fetchExamQuestions",

  async (attemptId, { rejectWithValue }) => {
    try {
      const data =
        await studentExamService.getExamQuestions(
          attemptId
        );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch exam."
      );
    }
  }
);