const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const testController = require("../controllers/test.controller");

// Create Test
router.post(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  testController.createTest
);

module.exports = router;