import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Students from "../pages/admin/Students";
import Exams from "../pages/admin/Exams";
import Tests from "../pages/admin/Tests";
import Results from "../pages/admin/Results";
import Settings from "../pages/admin/Settings";
import Announcements from "../pages/admin/Announcements";
import CreateAnnouncement from "../pages/admin/CreateAnnouncement";
import EditAnnouncement from "../pages/admin/EditAnnouncement";
import Notifications from "../pages/student/Notifications";
import StudentLayout from "../layouts/StudentLayout";
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentExams from "../pages/student/StudentExams";
import ExamInstructions from "../pages/student/ExamInstructions";
import Questions from "../pages/admin/Questions";
import CreateQuestion from "../pages/admin/CreateQuestion";
import EditQuestion from "../pages/admin/EditQuestion";
import QuestionDetails from "../pages/admin/QuestionDetails";
import CreateTest from "../pages/admin/CreateTest";
import TestDetails from "../pages/admin/TestDetails";
import EditTest from "../pages/admin/EditTest";
import ProfilePage from "../pages/student/ProfilePage";
import StudentSettings from "../pages/student/StudentSettings";
import ResultPage from "../pages/student/ResultPage";
import ResultHistory from "../pages/student/ResultHistory";
import ExamPage from "../pages/student/ExamPage";
import ReviewAnswersPage from "../pages/student/ReviewAnswersPage";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    
  return (
        <Routes>

        {/* Public Route */}
       <Route path="/" element={<LoginPage />} />

        <Route path="/login" element={<LoginPage />} />


        {/* Protected Route */}
        {/* console.log("AppRoutes Rendered"); */}
        <Route
            path="/admin/dashboard"
            element={
            <ProtectedRoute>
                <AdminDashboard />
            </ProtectedRoute>
            }
        />
        <Route
            path="/admin/questions"
            element={
                <ProtectedRoute>
                <Questions />
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/questions/create"
            element={
                <ProtectedRoute>
                <CreateQuestion />
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/questions/edit/:id"
            element={
                <ProtectedRoute>
                <EditQuestion />
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/questions/:id"
            element={
                <ProtectedRoute>
                <QuestionDetails />
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/tests/create"
            element={
              <ProtectedRoute>
                <CreateTest />
              </ProtectedRoute>
            }
            
        />
        <Route
            path="/admin/tests/:id"
            element={
                <ProtectedRoute>
                <TestDetails />
                </ProtectedRoute>
            }
        />

        <Route
            path="/admin/tests/:id/edit"
            element={
                <ProtectedRoute>
                <EditTest />
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/students"
            element={
                <ProtectedRoute>
                <Students />
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/exams"
            element={
                <ProtectedRoute>
                <Exams />
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/tests"
            element={
                <ProtectedRoute>
                <Tests />
                </ProtectedRoute>
            }
        />

        <Route
            path="/admin/results"
            element={
                <ProtectedRoute>
                <Results />
                </ProtectedRoute>
            }
        />

        <Route
            path="/admin/settings"
            element={
                <ProtectedRoute>
                <Settings />
                </ProtectedRoute>
            }
        />  
        <Route
            path="/admin/announcements"
            element={
                <ProtectedRoute>
                <Announcements />
                </ProtectedRoute>
            }
        /> 
        <Route
            path="/admin/announcements/create"
            element={
                <ProtectedRoute>
                <CreateAnnouncement />
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/announcements/:id/edit"
            element={
                <ProtectedRoute>
                <EditAnnouncement />
                </ProtectedRoute>
            }
        />

            <Route
                path="/student"
                element={
                    <ProtectedRoute>
                    <StudentLayout />
                    </ProtectedRoute>
                }
                >
                <Route path="dashboard" element={<StudentDashboard />} />

                <Route path="profile" element={<ProfilePage />} />
                <Route
                    path="settings"
                    element={<StudentSettings />}
                />
                <Route
                    path="notifications"
                    element={<Notifications />}
                />

                <Route path="exams" element={<StudentExams />} />

                <Route
                    path="exam/instructions"
                    element={<ExamInstructions />}
                />

                <Route
                    path="exam/:attemptId"
                    element={<ExamPage />}
                />

                <Route
                    path="result/:attemptId"
                    element={<ResultPage />}
                />

                <Route
                    path="results/history"
                    element={<ResultHistory />}
                />
                <Route
                    path="result/:attemptId/review"
                    element={<ReviewAnswersPage />}
                />
            </Route>

        </Routes>
    );
}

export default AppRoutes;