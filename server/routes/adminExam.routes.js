const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
    getExamMonitoring,
    getStudentAttempts,
} = require("../controllers/adminExam.controller");

// =====================================
// EXAM MONITORING
// =====================================

router.get(
  "/:snapshotId/monitor",
  protect,
  authorize("admin", "superAdmin"),
  getExamMonitoring
);
// =====================================
// STUDENT ATTEMPT LIST
// =====================================

router.get(
  "/:snapshotId/attempts",
  protect,
  authorize("admin", "superAdmin"),
  getStudentAttempts
);

module.exports = router;