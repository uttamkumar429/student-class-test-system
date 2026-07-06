const validator = require("validator");

const validateRegister = (body) => {
  const errors = [];

  if (!body.fullName || body.fullName.trim().length < 3)
    errors.push("Full name is required.");

  if (!validator.isEmail(body.email || ""))
    errors.push("Invalid email.");

  if (!validator.isMobilePhone(body.phone || "", "en-IN"))
    errors.push("Invalid phone number.");

  if (
    !validator.isStrongPassword(body.password || "", {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    errors.push(
      "Password must contain uppercase, lowercase, number and special character."
    );
  }

  return errors;
};

module.exports = validateRegister;