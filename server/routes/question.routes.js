const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const questionController = require("../controllers/question.controller");
const validate = require("../middleware/validation.middleware");
const validateQuestion = require("../validators/question.validator");

/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Create Question
 *     description: Creates a new question in the question bank.
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Question created successfully.
 *       400:
 *         description: Invalid request.
 *       401:
 *         description: Unauthorized.
 */
// Create Question
router.post(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  validate(validateQuestion),
  questionController.createQuestion
);
/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Get All Questions
 *     description: Returns all questions from the question bank.
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Questions fetched successfully.
 *       401:
 *         description: Unauthorized.
 */
// Get All Questions
router.get(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  questionController.getAllQuestions
);
/**
 * @swagger
 * /api/questions/{id}:
 *   get:
 *     summary: Get Question By ID
 *     description: Returns details of a specific question.
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question fetched successfully.
 *       404:
 *         description: Question not found.
 */
// Get Question By Id
router.get(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  questionController.getQuestionById
);
/**
 * @swagger
 * /api/questions/{id}:
 *   put:
 *     summary: Update Question
 *     description: Updates an existing question.
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question updated successfully.
 *       404:
 *         description: Question not found.
 */
// Update Question
router.put(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  questionController.updateQuestion
);
/**
 * @swagger
 * /api/questions/{id}:
 *   delete:
 *     summary: Delete Question
 *     description: Deletes a question from the question bank.
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question deleted successfully.
 *       404:
 *         description: Question not found.
 */
// Delete Question
router.delete(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  questionController.deleteQuestion
);

module.exports = router;