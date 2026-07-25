const bcrypt = require("bcrypt");
const User = require("../models/User");

const authenticateUser = async (emailOrPhone, password) => {

  const user = await User.findOne({
    $or: [
      { email: emailOrPhone.trim().toLowerCase() },
      { phone: emailOrPhone }
    ]
  });

  if (!user) {
    return {
      success: false,
      message: "Invalid Credentials"
    };
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    return {
      success: false,
      message: "Invalid Credentials"
    };
  }

  return {
    success: true,
    user
  };

};

module.exports = {
  authenticateUser
};