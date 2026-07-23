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
    userId: `TEST${Date.now()}${Math.floor(Math.random() * 10000)}`,
  });
};

module.exports = createUser;