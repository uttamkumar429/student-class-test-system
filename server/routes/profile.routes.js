const upload = require("../middleware/upload.middleware");

const uploadController = require("../controllers/upload.controller");


const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const profileController = require("../controllers/profile.controller");

// Get Profile
router.get(
  "/",
  protect,
  profileController.getProfile
);

// Update Profile
router.put(
  "/update",
  protect,
  profileController.updateProfile
);
router.put(
  "/photo",
  protect,
  upload.single("profilePhoto"),
  uploadController.uploadProfilePhoto
);
module.exports = router;
