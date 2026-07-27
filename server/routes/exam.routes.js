const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const examController = require("../controllers/exam.controller");

// Get All Exams
router.get(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  examController.getExams
);

// Create Exam
router.post(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  examController.createExam
);

// Get Exam By Id
router.get(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  examController.getExamById
);

// Update Exam
router.put(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  examController.updateExam
);

// Delete Exam
router.delete(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  examController.deleteExam
);

module.exports = router;