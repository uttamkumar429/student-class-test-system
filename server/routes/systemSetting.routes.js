const express = require("express");

const router = express.Router();

const {
  protect,
} = require("../middleware/auth.middleware");

const {
  adminOnly,
} = require("../middleware/admin.middleware");

const controller =
  require("../controllers/systemSetting.controller");

// ======================================
// ALL SETTINGS
// ======================================

router.get(
  "/",
  protect,
  adminOnly,
  controller.getSettings
);

// ======================================
// SINGLE SETTING
// ======================================

router.get(
  "/:key",
  protect,
  adminOnly,
  controller.getSetting
);

// ======================================
// UPDATE PASS PERCENTAGE
// ======================================

router.patch(
  "/pass-percentage",
  protect,
  adminOnly,
  controller.updatePassPercentage
);

module.exports = router;