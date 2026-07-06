const express = require("express");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Auth Route Working" });
});

const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
module.exports = router;