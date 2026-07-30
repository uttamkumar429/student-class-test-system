import { createAsyncThunk } from "@reduxjs/toolkit";
import * as studentExamService from "../../services/studentExamService";

export const startExam = createAsyncThunk(
  "studentExam/startExam",
  async (snapshotId, { rejectWithValue }) => {
    try {
      const data = await studentExamService.startExam(snapshotId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to start exam."
      );
    }
  }
);
export const resumeExam = createAsyncThunk(
  "studentExam/resumeExam",
  async (_, { rejectWithValue }) => {
    try {
      return await studentExamService.resumeExam();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to resume exam."
      );
    }
  }
);
export const saveAnswer = createAsyncThunk(
  "studentExam/saveAnswer",
  async (
    { attemptId, payload },
    { rejectWithValue }
  ) => {
    try {
      const data = await studentExamService.saveAnswer(
        attemptId,
        payload
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to save answer."
      );
    }
  }
);
export const submitExam = createAsyncThunk(
  "studentExam/submitExam",
  async (attemptId, { rejectWithValue }) => {
    try {
      const data = await studentExamService.submitExam(attemptId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to submit exam."
      );
    }
  }
);