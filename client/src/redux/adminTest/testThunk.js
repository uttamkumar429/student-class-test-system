import { createAsyncThunk } from "@reduxjs/toolkit";

import adminTestService from "../../services/adminTestService";

// ==============================================
// FETCH ALL TESTS
// ==============================================

export const fetchTests = createAsyncThunk(
  "adminTest/fetchTests",

  async (params = {}, thunkAPI) => {
    try {
      return adminTestService.getTests(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch tests."
      );
    }
  }
);

// ==============================================
// FETCH SINGLE TEST
// ==============================================

export const fetchTestById = createAsyncThunk(
  "adminTest/fetchTestById",

  async (testId, thunkAPI) => {
    try {
      return adminTestService.getTestById(testId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch test."
      );
    }
  }
);

// ==============================================
// CREATE TEST
// ==============================================

export const createTest = createAsyncThunk(
  "adminTest/createTest",

  async (testData, thunkAPI) => {
    try {
      return adminTestService.createTest(testData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to create test."
      );
    }
  }
);

// ==============================================
// UPDATE TEST
// ==============================================

export const updateTest = createAsyncThunk(
  "adminTest/updateTest",

  async (
    { testId, testData },
    thunkAPI
  ) => {
    try {
      return adminTestService.updateTest(
        testId,
        testData
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to update test."
      );
    }
  }
);

// ==============================================
// DELETE TEST
// ==============================================

export const deleteTest = createAsyncThunk(
  "adminTest/deleteTest",

  async (testId, thunkAPI) => {
    try {
      await adminTestService.deleteTest(
        testId
      );

      return testId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to delete test."
      );
    }
  }
);

// ==============================================
// PUBLISH TEST
// ==============================================

export const publishTest = createAsyncThunk(
  "adminTest/publishTest",

  async (testId, thunkAPI) => {
    try {
      return adminTestService.publishTest(
        testId
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to publish test."
      );
    }
  }
);