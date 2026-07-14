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

/**
 * @swagger
 * /api/admin/reports/attempts/{attemptId}:
 *   get:
 *     summary: Get Student Report
 *     description: Returns the detailed report of a student's exam attempt.
 *     tags:
 *       - Admin Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a54880efdad7d6b6f123456
 *     responses:
 *       200:
 *         description: Student report fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Attempt not found.
 */

/**
 * @swagger
 * /api/admin/reports/attempts/{attemptId}/pdf:
 *   get:
 *     summary: Download Student Report PDF
 *     description: Downloads the student's examination report in PDF format.
 *     tags:
 *       - Admin Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a54880efdad7d6b6f123456
 *     responses:
 *       200:
 *         description: PDF downloaded successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */

/**
 * @swagger
 * /api/admin/reports/exams/{snapshotId}/csv:
 *   get:
 *     summary: Export Exam Result CSV
 *     description: Downloads all exam results in CSV format.
 *     tags:
 *       - Admin Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: snapshotId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a5475b6897b8f8b44ccc807
 *     responses:
 *       200:
 *         description: CSV exported successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */

/**
 * @swagger
 * /api/admin/reports/exams/{snapshotId}/excel:
 *   get:
 *     summary: Export Exam Result Excel
 *     description: Downloads all exam results in Microsoft Excel format.
 *     tags:
 *       - Admin Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: snapshotId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a5475b6897b8f8b44ccc807
 *     responses:
 *       200:
 *         description: Excel exported successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */

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