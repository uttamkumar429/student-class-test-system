const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  getAvailableExams,
  startExam,
  saveAnswer,
} = require("../controllers/studentExam.controller");

/**
 * @swagger
 * /api/student/exams:
 *   get:
 *     summary: Get Available Exams
 *     description: Returns all published exams available for the logged-in student.
 *     tags:
 *       - Student Exams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - newest
 *             - oldest
 *             - title
 *             - subject
 *     responses:
 *       200:
 *         description: Available exams fetched successfully.
 *       401:
 *         description: Unauthorized.
 */

// =====================================
// GET AVAILABLE EXAMS
// =====================================

router.get(
  "/exams",
  protect,
  authorize("student"),
  getAvailableExams
);

// =====================================
// START EXAM
// =====================================

router.post(
  "/exams/:testId/start",
  protect,
  authorize("student"),
  startExam
);

// =====================================
// SAVE ANSWER
// =====================================

router.put(
  "/exams/:attemptId/answer",
  protect,
  authorize("student"),
  saveAnswer
);

module.exports = router;