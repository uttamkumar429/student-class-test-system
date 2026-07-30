import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getResult,
  getResultHistory,
} from "../../services/studentResultService";

// ======================================
// GET RESULT
// ======================================
export const fetchResult = createAsyncThunk(
  "studentResult/fetchResult",
  async (attemptId, { rejectWithValue }) => {
    try {
      const data = await getResult(attemptId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch result."
      );
    }
  }
);

// ======================================
// GET RESULT HISTORY
// ======================================
export const fetchResultHistory = createAsyncThunk(
  "studentResult/fetchResultHistory",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getResultHistory();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch result history."
      );
    }
  }
);