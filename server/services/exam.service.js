const mongoose = require("mongoose");

const ExamAttempt = require("../models/ExamAttempt");
const TestSnapshot = require("../models/TestSnapshot");

const ApiError = require("../utils/ApiError");

const startExam = async (
  studentId,
  testId
) => {

  // ===================================================
  // FETCH SNAPSHOT
  // ===================================================

  const snapshot = await TestSnapshot.findOne({
    testId,
  }).lean();

  if (!snapshot) {
    throw new ApiError(
      404,
      "Published test not found."
    );
  }

  // ===================================================
  // CHECK EXISTING ATTEMPT
  // ===================================================

  const existingAttempt =
    await ExamAttempt.findOne({
      student: studentId,
      testSnapshot: snapshot._id,
    });

  // ===================================================
  // IF ALREADY SUBMITTED
  // ===================================================

  if (
    existingAttempt &&
    existingAttempt.status === "SUBMITTED"
  ) {
    throw new ApiError(
      409,
      "Exam already submitted."
    );
  }

  // ===================================================
  // RESUME EXAM
  // ===================================================

  if (existingAttempt) {

    return existingAttempt;

  }

  // ===================================================
  // CREATE ATTEMPT
  // ===================================================

  const attempt =
    await ExamAttempt.create({

      student: studentId,

      testSnapshot: snapshot._id,

      totalQuestions:
        snapshot.totalQuestions,

      totalMarks:
        snapshot.totalMarks,

      currentQuestionIndex: 0,

      status: "IN-PROGRESS",

    });

  return attempt;
};

module.exports = {

  startExam,

};


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