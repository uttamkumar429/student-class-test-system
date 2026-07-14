const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

const profileController = require("../controllers/profile.controller");

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get Logged-in User Profile
 *     description: Returns the profile details of the authenticated user.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully.
 *       401:
 *         description: Unauthorized.
 */

/**
 * @swagger
 * /api/profile/update:
 *   put:
 *     summary: Update Logged-in User Profile
 *     description: Update profile information of the authenticated user.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Rahul Kumar
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: Invalid request.
 *       401:
 *         description: Unauthorized.
 */

// Get Profile
router.get("/", protect, profileController.getProfile);

// Update Profile
router.put("/update", protect, profileController.updateProfile);
module.exports = router