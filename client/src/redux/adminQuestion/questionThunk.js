import { createAsyncThunk } from "@reduxjs/toolkit";

import adminQuestionService from "../../services/adminQuestionService";

// ==============================================
// FETCH QUESTION METADATA
// ==============================================

export const fetchQuestionMetadata =
  createAsyncThunk(
    "adminQuestion/fetchQuestionMetadata",
    async (_, thunkAPI) => {
      try {
        return await adminQuestionService.getQuestionMetadata();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch question metadata."
        );
      }
    }
  );

// ==============================================
// FETCH ALL QUESTIONS
// ==============================================

export const fetchQuestions = createAsyncThunk(
  "adminQuestion/fetchQuestions",

  async (params = {}, thunkAPI) => {
    try {
      return await adminQuestionService.getQuestions(
        params
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch questions."
      );
    }
  }
);

// ==============================================
// FETCH SINGLE QUESTION
// ==============================================

export const fetchQuestionById = createAsyncThunk(
  "adminQuestion/fetchQuestionById",

  async (questionId, thunkAPI) => {
    try {
      return await adminQuestionService.getQuestionById(
        questionId
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch question."
      );
    }
  }
);

// ==============================================
// CREATE QUESTION
// ==============================================

export const createQuestion = createAsyncThunk(
  "adminQuestion/createQuestion",

  async (questionData, thunkAPI) => {
    try {
      return await adminQuestionService.createQuestion(
        questionData
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to create question."
      );
    }
  }
);

// ==============================================
// UPDATE QUESTION
// ==============================================

export const updateQuestion = createAsyncThunk(
  "adminQuestion/updateQuestion",

  async (
    { questionId, questionData },
    thunkAPI
  ) => {
    try {
      return await adminQuestionService.updateQuestion(
        questionId,
        questionData
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to update question."
      );
    }
  }
);

// ==============================================
// DELETE QUESTION
// ==============================================

export const deleteQuestion = createAsyncThunk(
  "adminQuestion/deleteQuestion",

  async (questionId, thunkAPI) => {
    try {
      await adminQuestionService.deleteQuestion(
        questionId
      );

      return questionId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete question."
      );
    }
  }
);