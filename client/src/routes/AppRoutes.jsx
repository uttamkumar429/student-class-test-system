import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Students from "../pages/admin/Students";
import Exams from "../pages/admin/Exams";
import Tests from "../pages/admin/Tests";
import Results from "../pages/admin/Results";
import Settings from "../pages/admin/Settings";
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

        </Routes>
    );
}

export default AppRoutes;