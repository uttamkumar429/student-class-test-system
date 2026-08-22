const express = require("express");

const router = express.Router();
const { protect } = require("../middleware/auth.middleware");


const studentDashboardController = require("../controllers/studentDashboard.controller");

// =======================================================
// Student Dashboard
// GET /api/student/dashboard
// =======================================================
router.get(
  "/",
  protect,
  studentDashboardController.getDashboard
);

module.exports = router;
