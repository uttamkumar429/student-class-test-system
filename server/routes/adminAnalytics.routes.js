const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  getExamStatistics,
} = require("../controllers/adminAnalytics.controller");

// =====================================
// EXAM STATISTICS
// =====================================

router.get(
  "/exams/:snapshotId/statistics",
  protect,
  authorize("admin", "superAdmin"),
  getExamStatistics
);

module.exports = router;