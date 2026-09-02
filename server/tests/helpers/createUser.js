const bcrypt = require("bcrypt");
const User = require("../../models/User");

const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(
    userData.password,
    12
  );

  return await User.create({
    ...userData,
    password: hashedPassword,
    // API authorization tests need an authenticated student token.
    // Production registration still creates users as unverified; this
    // helper only controls test fixtures. Respect an explicit override.
    isVerified: userData.isVerified ?? true,
    userId: `TEST${Date.now()}${Math.floor(Math.random() * 10000)}`,
  });
};

module.exports = createUser;