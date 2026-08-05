const bcrypt = require("bcrypt");
const User = require("../models/User");

const authenticateUser = async (emailOrPhone, password) => {

  console.log("==================================");
  console.log("LOGIN ID:", emailOrPhone);

  const user = await User.findOne({
    $or: [
      { email: emailOrPhone.trim().toLowerCase() },
      { phone: emailOrPhone }
    ]
  });

  console.log("USER FOUND:", user);

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

  console.log("PASSWORD MATCH:", isPasswordMatched);

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