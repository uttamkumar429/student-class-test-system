const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const questionController = require("../controllers/question.controller");

// Create Question
router.post(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  questionController.createQuestion
);

module.exports = router;