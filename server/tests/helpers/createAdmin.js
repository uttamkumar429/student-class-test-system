const bcrypt = require("bcrypt");

const User = require("../../models/User");

const users = require("../fixtures/users");

const createAdmin = async () => {

  const hashedPassword = await bcrypt.hash(
    users.admin.password,
    12
  );

  return await User.create({

    userId: `ADMIN${Date.now()}${Math.floor(
      Math.random() * 10000
    )}`,

    fullName: users.admin.fullName,

    email: users.admin.email,

    phone: users.admin.phone,

    password: hashedPassword,

    role: "admin",

  });

};

module.exports = createAdmin;