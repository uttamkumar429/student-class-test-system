const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

const profileController = require("../controllers/profile.controller");

// Get Profile
router.get("/", protect, profileController.getProfile);

// Update Profile
router.put("/update", protect, profileController.updateProfile);

module.exports = router;
