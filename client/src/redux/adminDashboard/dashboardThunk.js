import { createAsyncThunk } from "@reduxjs/toolkit";

import adminDashboardService from "../../services/adminDashboardService";

export const fetchDashboard =
createAsyncThunk(

    "adminDashboard/fetchDashboard",

    async (_, thunkAPI) => {

        try {

            return await adminDashboardService.getDashboard();

        }

        catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to load dashboard."

            );

        }

    }

);