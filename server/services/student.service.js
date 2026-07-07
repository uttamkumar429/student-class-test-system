const ExamAttempt = require("../models/ExamAttempt");
const TestSnapshot = require("../models/TestSnapshot");


// ==========================================
// STUDENT DASHBOARD
// ==========================================
const getDashboard = async () => {

  const now = new Date();

  const upcoming = await TestSnapshot.find({
    startTime: { $gt: now }
  })
    .select(
      "title subject duration totalMarks totalQuestions startTime endTime"
    )
    .sort({ startTime: 1 });

  const active = await TestSnapshot.find({
    startTime: { $lte: now },
    endTime: { $gte: now }
  })
    .select(
      "title subject duration totalMarks totalQuestions startTime endTime"
    )
    .sort({ startTime: 1 });

  const completed = await TestSnapshot.find({
    endTime: { $lt: now }
  })
    .select(
      "title subject duration totalMarks totalQuestions startTime endTime"
    )
    .sort({ endTime: -1 });

  return {
    upcoming,
    active,
    completed,
  };

};


// START EXAM
// =====================================
const startExam = async (studentId, snapshotId) => {

  // Find Snapshot
  const snapshot = await TestSnapshot.findById(snapshotId);

  if (!snapshot) {
    throw new Error("Test not found.");
  }

  const now = new Date();

  // Check Exam Time
  if (now < snapshot.startTime) {
    throw new Error("Exam has not started yet.");
  }

  if (now > snapshot.endTime) {
    throw new Error("Exam has already ended.");
  }

  // Check Existing Attempt
  const existingAttempt = await ExamAttempt.findOne({
    student: studentId,
    testSnapshot: snapshotId,
  });

  if (existingAttempt) {
    throw new Error("You have already started this exam.");
  }

  // Create Attempt
  const attempt = await ExamAttempt.create({

    student: studentId,

    testSnapshot: snapshotId,

    totalQuestions: snapshot.totalQuestions,

    totalMarks: snapshot.totalMarks,

  });

  return attempt;

};

module.exports = {
  getDashboard,
  startExam,
};