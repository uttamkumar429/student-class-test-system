const express = require("express");

const router = express.Router();

const {
  startTest,
} = require("../controllers/studentTest.controller");

const { protect } = require("../middleware/auth.middleware");

router.post(
  "/tests/:testId/start",
  protect,
  startTest
);

module.exports = router;