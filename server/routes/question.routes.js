const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const questionController = require("../controllers/question.controller");


// Create Question
router.post(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  questionController.createQuestion
);
router.get(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  questionController.getAllQuestions
);
// Get Question By Id
router.get(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  questionController.getQuestionById
);

// Update Question
router.put(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  questionController.updateQuestion
);

// Delete Question
router.delete(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  questionController.deleteQuestion
);

module.exports = router;