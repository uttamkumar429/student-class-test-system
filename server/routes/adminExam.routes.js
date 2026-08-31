const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  getExamMonitoring,
  getStudentAttempts,
  getAttemptDetails,
  getPublishedExams,
} = require("../controllers/adminExam.controller");

/**
 * @swagger
 * /api/admin/exams/{snapshotId}/monitor:
 *   get:
 *     summary: Monitor Live Exam
 *     description: Returns live monitoring information of a published exam.
 *     tags:
 *       - Admin Exam
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
 *         description: Monitoring data fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */

/**
 * @swagger
 * /api/admin/exams/{snapshotId}/attempts:
 *   get:
 *     summary: Get Student Attempts
 *     description: Returns all student attempts for a published exam.
 *     tags:
 *       - Admin Exam
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
 *         description: Student attempts fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */

/**
 * @swagger
 * /api/admin/exams/{snapshotId}/attempts/{attemptId}:
 *   get:
 *     summary: Get Attempt Details
 *     description: Returns complete details of a student's exam attempt.
 *     tags:
 *       - Admin Exam
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: snapshotId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a5475b6897b8f8b44ccc807
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a54880efdad7d6b6f123456
 *     responses:
 *       200:
 *         description: Attempt details fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Attempt not found.
 */


// =====================================
// PUBLISHED EXAM LIST
// =====================================

router.get(
  "/published",
  protect,
  authorize("admin", "superAdmin"),
  getPublishedExams
);
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

// =====================================
// ATTEMPT DETAILS
// =====================================

router.get(
  "/:snapshotId/attempts/:attemptId",
  protect,
  authorize("admin", "superAdmin"),
  getAttemptDetails
);

module.exports = router;