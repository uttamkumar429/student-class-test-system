import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";

import studentProfileReducer from "./studentProfile/profileSlice";

import dashboardReducer from "./studentDashboard/dashboardSlice";

import examReducer from "./studentExam/examSlice";

import resultReducer from "./studentResult/resultSlice";
import reviewReducer from "./studentReview/reviewSlice";
export const store = configureStore({
  reducer: {

    auth: authReducer,

    studentProfile: studentProfileReducer,

    studentDashboard: dashboardReducer,

    studentExam: examReducer,

    studentResult: resultReducer,

    studentReview: reviewReducer,

  },
});