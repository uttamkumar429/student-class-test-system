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
// =====================================
// CHANGE PASSWORD
// =====================================

const changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user =
    await User.findById(userId);

  if (!user) {
    return {
      success: false,
      message: "User not found.",
    };
  }

  const isCurrentPasswordValid =
    await bcrypt.compare(
      currentPassword,
      user.password
    );

  if (!isCurrentPasswordValid) {
    return {
      success: false,
      message: "Current password is incorrect.",
    };
  }

  const isSamePassword =
    await bcrypt.compare(
      newPassword,
      user.password
    );

  if (isSamePassword) {
    return {
      success: false,
      message:
        "New password must be different from the current password.",
    };
  }

  const saltRounds =
    Number(
      process.env.BCRYPT_SALT_ROUNDS
    ) || 12;

  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      saltRounds
    );

  user.password =
    hashedPassword;

  await user.save();

  return {
    success: true,
    message:
      "Password changed successfully.",
  };
};

module.exports = {
  authenticateUser,
  changePassword,
};