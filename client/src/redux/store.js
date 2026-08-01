import { configureStore } from "@reduxjs/toolkit";
import examReducer from "./studentExam/examSlice";
import authReducer from "./slices/authSlice";
import studentProfileReducer from "./studentProfile/profileSlice";
import dashboardReducer from "./studentDashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,

    studentProfile: studentProfileReducer,

    studentDashboard: dashboardReducer,

    studentExam: examReducer,   // ✅ ADD THIS
  },
});