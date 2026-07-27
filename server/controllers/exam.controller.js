const Exam = require("../models/Exam");
const generateExamId = require("../utils/generateExamId");
const asyncHandler = require("../middleware/asyncHandler");
const { successResponse } = require("../utils/response");

const {
  getExams: getExamsService,
  getExamById: getExamByIdService,
} = require("../services/exam.service");
exports.getExams = asyncHandler(async (req, res) => {
  const exams = await getExamsService();

  return successResponse(
    res,
    200,
    "Exams fetched successfully.",
    exams
  );
});

exports.getExamById = asyncHandler(async (req, res) => {
  const exam = await getExamByIdService(req.params.id);

  return successResponse(
    res,
    200,
    "Exam fetched successfully.",
    exam
  );
});
exports.createExam = asyncHandler(async (req, res) => {
  const {
    title,
    subject,
    className,
    totalMarks,
    duration,
    examDate,
  } = req.body;

  if (
    !title ||
    !subject ||
    !className ||
    !totalMarks ||
    !duration ||
    !examDate
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  const exam = await Exam.create({
    examId: generateExamId(),
    title: title.trim(),
    subject: subject.trim(),
    className: className.trim(),
    totalMarks,
    duration,
    examDate,
    createdBy: req.user._id,
  });

  return successResponse(
    res,
    201,
    "Exam created successfully.",
    exam
  );
});

exports.updateExam = asyncHandler(async (req, res) => {
  const {
    title,
    subject,
    className,
    totalMarks,
    duration,
    examDate,
    status,
  } = req.body;

  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    return res.status(404).json({
      success: false,
      message: "Exam not found.",
    });
  }

  if (title) {
    exam.title = title.trim();
  }

  if (subject) {
    exam.subject = subject.trim();
  }

  if (className) {
    exam.className = className.trim();
  }

  if (totalMarks) {
    exam.totalMarks = totalMarks;
  }

  if (duration) {
    exam.duration = duration;
  }

  if (examDate) {
    exam.examDate = examDate;
  }

  if (status) {
    exam.status = status;
  }

  await exam.save();

  return successResponse(
    res,
    200,
    "Exam updated successfully.",
    exam
  );
});

exports.deleteExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    return res.status(404).json({
      success: false,
      message: "Exam not found.",
    });
  }

  await exam.deleteOne();

  return successResponse(
    res,
    200,
    "Exam deleted successfully."
  );
});