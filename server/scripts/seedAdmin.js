require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const connectDB = require("../config/db");
const User = require("../models/User");
const generateUserId = require("../utils/generateUserId");

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      role: "admin",
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      12
    );

    await User.create({
      userId: generateUserId(),
      fullName: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      phone: "9999999999", // Development default
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    console.log("🎉 Admin created successfully.");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();