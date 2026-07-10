const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const publishController = require("../controllers/publish.controller");

// Publish Test
router.post(
  "/:id/publish",
  protect,
  authorize("admin", "superAdmin"),
  publishController.publishTest
);

module.exports = router;