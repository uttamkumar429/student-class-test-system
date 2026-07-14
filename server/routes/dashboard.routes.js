const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  getDashboardStats,
} = require("../controllers/dashboard.controller");

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get Admin Dashboard Statistics
 *     description: Returns dashboard overview, recent activity, and analytics for administrators.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */

router.get(
  "/stats",
  protect,
  authorize("admin", "superAdmin"),
  getDashboardStats
);

module.exports = router;