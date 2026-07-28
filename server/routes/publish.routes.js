const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const publishController = require("../controllers/publish.controller");

/**
 * @swagger
 * /api/tests/{id}/publish:
 *   post:
 *     summary: Publish a Test
 *     description: Publish a draft test and create a test snapshot for students.
 *     tags:
 *       - Publish Test
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a5475b6897b8f8b44ccc807
 *     responses:
 *       200:
 *         description: Test published successfully.
 *       400:
 *         description: Invalid request.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Test not found.
 */

// Publish Test
router.post(
  "/:id/publish",
  protect,
  authorize("admin", "superAdmin"),
  publishController.publishTest
);

module.exports = router;
