const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateUserId = require("../utils/generateUserId");
const asyncHandler = require("../middleware/asyncHandler");
const { successResponse } = require("../utils/response");

const {
  getStudents: getStudentsService,
  getStudentById: getStudentByIdService,
} = require("../services/adminStudent.service");
exports.getStudentById = asyncHandler(async (req, res) => {

  const student = await getStudentByIdService(req.params.id);

  return successResponse(
    res,
    200,
    "Student fetched successfully.",
    student
  );

});
exports.getStudents = asyncHandler(async (req, res) => {

  const students = await getStudentsService();

  return successResponse(
    res,
    200,
    "Students fetched successfully.",
    students
  );

});
exports.createStudent = asyncHandler(async (req, res) => {

  const {
    fullName,
    email,
    phone,
    password,
  } = req.body;

  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required."
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    $or: [
      { email: normalizedEmail },
      { phone }
    ]
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "Email or phone already exists."
    });
  }

  const saltRounds =
    Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

  const hashedPassword =
    await bcrypt.hash(password, saltRounds);

  const student = await User.create({

    userId: generateUserId(),

    fullName,

    email: normalizedEmail,

    phone,

    password: hashedPassword,

    role: "student"

  });

  return successResponse(
    res,
    201,
    "Student created successfully.",
    {
      id: student._id,
      userId: student.userId,
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
      role: student.role
    }
  );

});
exports.updateStudent = asyncHandler(async (req, res) => {

  const { fullName, email, phone } = req.body;

  const student = await User.findOne({
    _id: req.params.id,
    role: "student",
  });

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found."
    });
  }

  if (email && email !== student.email) {

    const emailExists = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email already exists."
      });
    }

    student.email = email.trim().toLowerCase();
  }

  if (phone && phone !== student.phone) {

    const phoneExists = await User.findOne({
      phone
    });

    if (phoneExists) {
      return res.status(409).json({
        success: false,
        message: "Phone already exists."
      });
    }

    student.phone = phone;
  }

  if (fullName) {
    student.fullName = fullName;
  }

  await student.save();

  return successResponse(
    res,
    200,
    "Student updated successfully.",
    {
      id: student._id,
      userId: student.userId,
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
      role: student.role
    }
  );

});
exports.deleteStudent = asyncHandler(async (req, res) => {

  const student = await User.findOne({
    _id: req.params.id,
    role: "student",
  });

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found.",
    });
  }

  await student.deleteOne();

  return successResponse(
    res,
    200,
    "Student deleted successfully."
  );

});