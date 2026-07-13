const express = require("express");

const router = express.Router();

const { adminLogin } = require("../controllers/auth.controller");

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin Login
 *     description: Login for Admin and Super Admin users.
 *     tags:
 *       - Admin Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailOrPhone
 *               - password
 *             properties:
 *               emailOrPhone:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: Admin login successful.
 *       400:
 *         description: Email/Phone and Password are required.
 *       401:
 *         description: Invalid credentials.
 *       403:
 *         description: Access denied. Admin only.
 */

router.post("/login", adminLogin);

module.exports = router;