const Exam = require("../models/Exam");

exports.getExams = async () => {
  return await Exam.find()
    .populate("createdBy", "fullName email")
    .sort({ createdAt: -1 });
};

exports.getExamById = async (id) => {
  return await Exam.findById(id)
    .populate("createdBy", "fullName email");
};