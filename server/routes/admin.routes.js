const express = require("express");

const router = express.Router();

const {
  getDashboard,
} = require("../controllers/admin.controller");

const {
    protect,
} = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

/**
 * ===========================================
 * ADMIN DASHBOARD
 * ===========================================
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get Admin Dashboard
 *     description: Returns dashboard statistics for admin.
 *     tags:
 *       - Admin Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */

router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  getDashboard
);

module.exports = router;