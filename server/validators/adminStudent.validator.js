const { body } = require("express-validator");

exports.createStudentValidator = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required."),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required."),

  body("phone")
    .trim()
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits."),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
];