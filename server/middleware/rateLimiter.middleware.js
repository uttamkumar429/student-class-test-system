const rateLimit = require("express-rate-limit");

const isProduction = process.env.NODE_ENV === "production";

// General API Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 100 : 100000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
});

// Login Limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

module.exports = {
  apiLimiter,
  loginLimiter,
};