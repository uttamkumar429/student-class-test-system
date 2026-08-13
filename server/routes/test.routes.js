const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const testController = require("../controllers/test.controller");
const validate = require("../middleware/validation.middleware");
const {
  validateCreateTest,
} = require("../validators/test.validator");
/**
 * @swagger
 * /api/tests:
 *   post:
 *     summary: Create Test
 *     description: Creates a new test with selected questions.
 *     tags:
 *       - Tests
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
            title:
            subject:
            description:
            duration:
            questions:
            startTime:
            endTime:
            status:
 *     responses:
 *       201:
 *         description: Test created successfully.
 *       400:
 *         description: Invalid request.
 *       401:
 *         description: Unauthorized.
 */
// Create Test
router.post(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  validate(validateCreateTest),
  testController.createTest
);
/**
 * @swagger
 * /api/tests:
 *   get:
 *     summary: Get All Tests
 *     description: Returns all available tests.
 *     tags:
 *       - Tests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tests fetched successfully.
 *       401:
 *         description: Unauthorized.
 */
// Get All Tests
router.get(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  testController.getAllTests
);
/**
 * @swagger
 * /api/tests/{id}:
 *   get:
 *     summary: Get Test By ID
 *     description: Returns complete details of a specific test.
 *     tags:
 *       - Tests
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
 *         description: Test fetched successfully.
 *       404:
 *         description: Test not found.
 */
// Get Test By ID
router.get(
  "/:id",
  protect,
  authorize("admin","superAdmin"),
  testController.getTestById
);
/**
 * @swagger
 * /api/tests/{id}:
 *   put:
 *     summary: Update Test
 *     description: Updates an existing test.
 *     tags:
 *       - Tests
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
 *         description: Test updated successfully.
 *       404:
 *         description: Test not found.
 */
// Update Test
router.put(
  "/:id",
  protect,
  authorize("admin","superAdmin"),
  validate(validateCreateTest),
  testController.updateTest
);
/**
 * @swagger
 * /api/tests/{id}:
 *   delete:
 *     summary: Delete Test
 *     description: Deletes a test permanently.
 *     tags:
 *       - Tests
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
 *         description: Test deleted successfully.
 *       404:
 *         description: Test not found.
 */
// Delete Test
router.delete(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  testController.deleteTest
);
router.post(
  "/:id/publish",
  protect,
  authorize(
  "admin",
  "superAdmin"
),
  testController.publishTest
);

module.exports = router;