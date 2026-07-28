import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Students from "../pages/admin/Students";
import Exams from "../pages/admin/Exams";
import Tests from "../pages/admin/Tests";
import Results from "../pages/admin/Results";
import Settings from "../pages/admin/Settings";
import StudentLayout from "../layouts/StudentLayout";
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentExams from "../pages/student/StudentExams";
import ExamInstructions from "../pages/student/ExamInstructions";
import CreateTest from "../pages/admin/CreateTest";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
        <Routes>

        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Route */}
        <Route
            path="/admin/dashboard"
            element={
            <ProtectedRoute>
                <AdminDashboard />
            </ProtectedRoute>
            }
        />
        <Route
            path="/admin/tests/create"
            element={<CreateTest />}
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
                path="/student"
                element={
                    <ProtectedRoute>
                    <StudentLayout />
                    </ProtectedRoute>
                }
                >
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="exams" element={<StudentExams />} />
                <Route
                    path="exam/instructions"
                    element={<ExamInstructions />}
                />
            </Route>

        </Routes>
    );
}

export default AppRoutes;