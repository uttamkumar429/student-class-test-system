const rateLimit = require("express-rate-limit");

// General API Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,

  skip: () => process.env.NODE_ENV === "test",

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
  max: 5,

  skip: () => process.env.NODE_ENV === "test",

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