const bcrypt = require("bcrypt");
const User = require("../models/User");

const {
  authenticateUser,
  changePassword:
    changePasswordService,
} = require("../services/auth.service");

const generateUserId = require("../utils/generateUserId");
const generateToken = require("../utils/generateToken");
const validateRegister = require("../validators/registerValidator");

// ===============================
// REGISTER
// ===============================
exports.register = async (req, res) => {
  try {
    const errors = validateRegister(req.body);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const {
      fullName,
      email,
      phone,
      password,
    } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { phone }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email or phone already registered.",
      });
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      userId: generateUserId(),
      fullName,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: {
        id: user._id,
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ===============================
// STUDENT LOGIN
// ===============================
exports.login = async (req, res) => {
  try {
  const {
    emailOrPhone,
    email,
    phone,
    password,
  } = req.body;

  const loginId = emailOrPhone || email || phone;

    // Required Validation
    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Phone and Password are required.",
      });
    }

    // Prevent NoSQL Injection / Invalid Types
    if (
      typeof loginId !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data.",
      });
    }

    const authResult = await authenticateUser(loginId, password);

    if (!authResult.success) {
      return res.status(401).json({
        success: false,
        message: authResult.message,
      });
    }

    const user = authResult.user;

    const token = generateToken(user._id, user.role);

    await User.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        userId: user.userId,
        fullName: user.fullName,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ===============================
// ADMIN LOGIN
// ===============================
exports.adminLogin = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Phone and Password are required.",
      });
    }

    // Prevent NoSQL Injection / Invalid Types
    if (
      typeof emailOrPhone !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data.",
      });
    }

    const authResult = await authenticateUser(emailOrPhone, password);

    if (!authResult.success) {
      return res.status(401).json({
        success: false,
        message: authResult.message,
      });
    }

    const user = authResult.user;

    // Only Admin or Super Admin can login
    if (user.role !== "admin" && user.role !== "superAdmin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const token = generateToken(user._id, user.role);

    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Admin Login Successful",
      token,
      user: {
        id: user._id,
        userId: user.userId,
        fullName: user.fullName,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const validatePasswordStrength = (
  password
) => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain at least one special character.";
  }

  return null;
};

// =====================================
// CHANGE PASSWORD
// =====================================

exports.changePassword =
  async (req, res) => {
    try {
      const {
        currentPassword,
        newPassword,
      } = req.body;

      // ---------------------------------
      // Required validation
      // ---------------------------------

      if (
        !currentPassword ||
        !newPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Current password and new password are required.",
        });
      }

      // ---------------------------------
      // Type validation
      // ---------------------------------

      if (
        typeof currentPassword !==
          "string" ||
        typeof newPassword !==
          "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid password data.",
        });
      }

      // ---------------------------------
      // Password strength
      // ---------------------------------

      const passwordError =
        validatePasswordStrength(
          newPassword
        );

      if (passwordError) {
        return res.status(400).json({
          success: false,
          message: passwordError,
        });
      }

      // ---------------------------------
      // Change password
      // ---------------------------------

      const result =
        await changePasswordService(
          req.user._id,
          currentPassword,
          newPassword
        );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Password changed successfully.",
      });

    } catch (error) {
      console.error(
        "Change Password Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Internal Server Error",
      });
    }
  };