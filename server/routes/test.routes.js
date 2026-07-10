const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const testController = require("../controllers/test.controller");

// Create Test
router.post(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  testController.createTest
);
// Get All Tests
router.get(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  testController.getAllTests
);
router.get(
  "/:id",
  protect,
  authorize("admin","superAdmin"),
  testController.getTestById
);
router.put(
  "/:id",
  protect,
  authorize("admin","superAdmin"),
  testController.updateTest
);
// Delete Test
router.delete(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  testController.deleteTest
);


module.exports = router;