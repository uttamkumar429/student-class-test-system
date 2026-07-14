const rateLimit = require("express-rate-limit");

// General API Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 100, // Max 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
});

// Login Limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

module.exports = {
  apiLimiter,
  loginLimiter,
};