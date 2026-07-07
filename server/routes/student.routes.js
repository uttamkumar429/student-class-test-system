const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const studentController = require("../controllers/student.controller");

// Student Dashboard
router.get(
  "/dashboard",
  protect,
  authorize("student"),
  studentController.getDashboard
);
// Start Exam
router.post(
  "/tests/:snapshotId/start",
  protect,
  authorize("student"),
  studentController.startExam
);
// Get Exam Questions
router.get(
  "/attempt/:attemptId/questions",
  protect,
  authorize("student"),
  studentController.getExamQuestions
);
// Save Answer
router.post(

  "/attempt/:attemptId/answer",

  protect,

  authorize("student"),

  studentController.saveAnswer

);
module.exports = router;