import { createAsyncThunk } from "@reduxjs/toolkit";
import studentReviewService from "../../services/studentReviewService";

export const fetchReview = createAsyncThunk(
  "studentReview/fetchReview",

  async (attemptId, { rejectWithValue }) => {
    try {
      return await studentReviewService.getReview(
        attemptId
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to load review."
      );
    }
  }
);