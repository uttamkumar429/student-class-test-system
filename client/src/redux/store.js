import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";

import studentProfileReducer from "./studentProfile/profileSlice";

import dashboardReducer from "./studentDashboard/dashboardSlice";

import examReducer from "./studentExam/examSlice";

import resultReducer from "./studentResult/resultSlice";
import reviewReducer from "./studentReview/reviewSlice";
import adminDashboardReducer from "./adminDashboard/dashboardSlice";
import adminQuestionReducer from "./adminQuestion/questionSlice";
import adminTestReducer from "./adminTest/testSlice";
import announcementReducer
  from "./studentAnnouncement/announcementSlice";
import adminAnnouncementReducer
  from "./adminAnnouncement/announcementSlice";
import settingsReducer from "./adminSettings/settingsSlice";
export const store = configureStore({
  reducer: {

    auth: authReducer,
    adminDashboard: adminDashboardReducer,
    adminQuestion: adminQuestionReducer,
    adminTest: adminTestReducer,
    
    adminAnnouncement:
    adminAnnouncementReducer,
    studentAnnouncement:
    announcementReducer,
    adminSettings: settingsReducer,
    studentProfile: studentProfileReducer,

    studentDashboard: dashboardReducer,

    studentExam: examReducer,

    studentResult: resultReducer,

    studentReview: reviewReducer,
   

  },
});