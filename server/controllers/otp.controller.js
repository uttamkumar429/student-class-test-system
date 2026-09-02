const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const {
  verifyMsg91AccessToken,
} = require("../services/msg91.service");

// ==========================================
// VERIFY STUDENT OTP
// ==========================================
exports.verifyStudentOtp = async (req, res) => {
  try {
    const { phone, accessToken } = req.body;

    // ------------------------------------------
    // Basic validation
    // ------------------------------------------
    if (!phone || !accessToken) {
      return res.status(400).json({
        success: false,
        message: "Phone number and access token are required.",
      });
    }

    if (
      typeof phone !== "string" ||
      typeof accessToken !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification data.",
      });
    }

    const normalizedPhone = phone.trim();

    // ------------------------------------------
    // Find user
    // ------------------------------------------
    const user = await User.findOne({
      phone: normalizedPhone,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ------------------------------------------
    // Blocked account check
    // ------------------------------------------
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    // ------------------------------------------
    // Verify MSG91 access token
    // ------------------------------------------
    const verification =
      await verifyMsg91AccessToken(accessToken);

    if (!verification.success) {
      return res.status(401).json({
        success: false,
        message: "OTP verification failed.",
      });
    }

    // ------------------------------------------
    // Mark user as verified
    // ------------------------------------------
    user.isVerified = true;
    user.lastLogin = new Date();

    await user.save();

    // ------------------------------------------
    // Generate TestVeda JWT
    // ------------------------------------------
    const token = generateToken(
      user._id,
      user.role
    );

    // ------------------------------------------
    // Success response
    // ------------------------------------------
    return res.status(200).json({
      success: true,
      message: "Mobile number verified successfully.",
      token,
      user: {
        id: user._id,
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error(
      "Verify Student OTP Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};