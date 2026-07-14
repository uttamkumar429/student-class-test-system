const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  getExamStatistics,
  getTopPerformers,
  getWeakStudents,
} = require("../controllers/adminAnalytics.controller");

/**
 * @swagger
 * /api/admin/analytics/exams/{snapshotId}/statistics:
 *   get:
 *     summary: Get Exam Statistics
 *     description: Returns overall statistics of a published exam.
 *     tags:
 *       - Admin Analytics
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
 *         description: Exam statistics fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */

/**
 * @swagger
 * /api/admin/analytics/exams/{snapshotId}/top-performers:
 *   get:
 *     summary: Get Top Performers
 *     description: Returns highest scoring students for a published exam.
 *     tags:
 *       - Admin Analytics
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
 *         description: Top performers fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */

/**
 * @swagger
 * /api/admin/analytics/exams/{snapshotId}/weak-students:
 *   get:
 *     summary: Get Weak Students
 *     description: Returns students who need improvement based on exam performance.
 *     tags:
 *       - Admin Analytics
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
 *         description: Weak students fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */

// =====================================
// EXAM STATISTICS
// =====================================

router.get(
  "/exams/:snapshotId/statistics",
  protect,
  authorize("admin", "superAdmin"),
  getExamStatistics
);

// =====================================
// TOP PERFORMERS
// =====================================

router.get(
  "/exams/:snapshotId/top-performers",
  protect,
  authorize("admin", "superAdmin"),
  getTopPerformers
);

// =====================================
// WEAK STUDENTS
// =====================================

router.get(
  "/exams/:snapshotId/weak-students",
  protect,
  authorize("admin", "superAdmin"),
  getWeakStudents
);

module.exports = router;