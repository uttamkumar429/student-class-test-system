const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");
const otpController = require("../controllers/otp.controller");
const {
  loginLimiter,
} = require("../middleware/rateLimiter.middleware");

const {
  protect,
} = require("../middleware/auth.middleware");

const authorize =
  require("../middleware/role.middleware");


// Test Route
if (process.env.NODE_ENV !== "production") {
  router.get("/test", (req, res) => {
    res.json({
      message: "Auth Route Working",
    });
  });
}
// Register
router.post("/register", authController.register);
// =====================================
// VERIFY STUDENT MOBILE OTP
// =====================================
router.post(
  "/verify-otp",
  loginLimiter,
  otpController.verifyStudentOtp
);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Student Login
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailOrPhone
 *               - password
 *             properties:
 *               emailOrPhone:
 *                 type: string
 *                 example: student@gmail.com
 *               password:
 *                 type: string
 *                 example: Student@123
 *     responses:
 *       200:
 *         description: Login Successful
 *       401:
 *         description: Invalid Credentials
 */

router.post(
  "/login",
  loginLimiter,
  authController.login
);

// =====================================
// CHANGE PASSWORD
// STUDENT
// =====================================

router.post(
  "/change-password",
  protect,
  authorize("student"),
  loginLimiter,
  authController.changePassword
);


router.post(
  "/admin/login",
  loginLimiter,
  authController.adminLogin
);

module.exports = router;