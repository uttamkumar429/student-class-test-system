const User = require("../models/User");
exports.getStudentById = async (id) => {

  const student = await User.findOne({
    _id: id,
    role: "student",
  }).select(
    "userId fullName email phone profileCompleted isVerified isBlocked lastLogin createdAt"
  );

  if (!student) {
    throw new Error("Student not found.");
  }

  return student;
};
exports.getStudents = async () => {

  const students = await User.find({ role: "student" })
    .select(
      "userId fullName email phone profileCompleted isVerified isBlocked lastLogin createdAt"
    )
    .sort({ createdAt: -1 });

  return students;

};