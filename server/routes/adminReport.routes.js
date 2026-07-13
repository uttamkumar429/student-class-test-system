const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  getStudentReport,
  downloadStudentReportPDF,
  exportExamCSV,
  exportExamExcel,
} = require("../controllers/adminReport.controller");

// =====================================
// STUDENT REPORT
// =====================================

router.get(
  "/attempts/:attemptId",
  protect,
  authorize("admin", "superAdmin"),
  getStudentReport
);
// DOWNLOAD PDF
router.get(
  "/attempts/:attemptId/pdf",
  protect,
  authorize("admin", "superAdmin"),
  downloadStudentReportPDF
);

// =====================================
// EXPORT CSV
// =====================================

router.get(
  "/exams/:snapshotId/csv",
  protect,
  authorize("admin", "superAdmin"),
  exportExamCSV
);
// =====================================
// EXPORT EXCEL
// =====================================

router.get(
  "/exams/:snapshotId/excel",
  protect,
  authorize("admin", "superAdmin"),
  exportExamExcel
);

module.exports = router;