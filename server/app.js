console.log("App.js Loaded");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

// =========================
// Import Routes
// =========================
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const profileRoutes = require("./routes/profile.routes");
const questionRoutes = require("./routes/question.routes");
const testRoutes = require("./routes/test.routes");
const publishRoutes = require("./routes/publish.routes");
const studentRoutes = require("./routes/student.routes");
const errorHandler = require("./middleware/error.middleware");
const dashboardRoutes = require("./routes/dashboard.routes");

// =========================
// Global Middleware
// =========================
app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

// =========================
// Health Check API
// =========================
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running successfully.",
  });
});

// =========================
// Routes
// =========================

// Authentication
app.use("/api/auth", authRoutes);

// Admin
app.use("/api/admin", adminRoutes);

// Profile
app.use("/api/profile", profileRoutes);

// Questions
app.use("/api/questions", questionRoutes);

// Tests (CRUD)
app.use("/api/tests", testRoutes);

// Publish Test
app.use("/api/tests", publishRoutes);

// Student APIs
app.use("/api/student", studentRoutes);
app.use(errorHandler);
app.use("/api/dashboard", dashboardRoutes);
// =========================
// 404 Route
// =========================
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// =========================
// Global Error Handler
// =========================
app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;