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
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required:
          - schoolName
          - className
        properties:
          schoolName:
            type: string
            example: ABC Public School

          className:
            type: string
            example: "12"

          section:
            type: string
            example: A

          rollNumber:
            type: string
            example: "24"

          dob:
            type: string
            format: date
            example: "2007-08-14"

          gender:
            type: string
            enum:
              - Male
              - Female
              - Other
            example: Male

          state:
            type: string
            example: Bihar

          district:
            type: string
            example: Gaya

          bio:
            type: string
            example: Preparing for JEE
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