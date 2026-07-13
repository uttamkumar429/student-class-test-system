const ExamAttempt = require("../models/ExamAttempt");
const TestSnapshot = require("../models/TestSnapshot");
const PASS_PERCENTAGE = 33;

// =====================================
// EXAM STATISTICS
// =====================================

const getExamStatistics = async (snapshotId) => {

  // Snapshot Exists?
  const snapshot = await TestSnapshot.findById(snapshotId);

  if (!snapshot) {
    throw new Error("Test snapshot not found.");
  }

  // All Attempts
  const attempts = await ExamAttempt.find({
    testSnapshot: snapshotId,
  });

  const totalStudents = attempts.length;

  const submitted = attempts.filter(
    (a) => a.status === "submitted"
  ).length;

  const running = attempts.filter(
    (a) => a.status === "in-progress"
  ).length;

  const obtainedMarks = attempts.map(
    (a) => a.obtainedMarks
  );

  const percentages = attempts.map(
    (a) => a.percentage
  );

  const averageMarks =
    totalStudents > 0
      ? Number(
          (
            obtainedMarks.reduce((a, b) => a + b, 0) /
            totalStudents
          ).toFixed(2)
        )
      : 0;

  const averagePercentage =
    totalStudents > 0
      ? Number(
          (
            percentages.reduce((a, b) => a + b, 0) /
            totalStudents
          ).toFixed(2)
        )
      : 0;

  const highestMarks =
    obtainedMarks.length > 0
      ? Math.max(...obtainedMarks)
      : 0;

  const lowestMarks =
    obtainedMarks.length > 0
      ? Math.min(...obtainedMarks)
      : 0;

  const passed = attempts.filter(
    (a) => a.percentage >= 33
  ).length;

  const failed = totalStudents - passed;

  const passPercentage =
    totalStudents > 0
      ? Number(
          ((passed / totalStudents) * 100).toFixed(2)
        )
      : 0;

  const failPercentage =
    totalStudents > 0
      ? Number(
          ((failed / totalStudents) * 100).toFixed(2)
        )
      : 0;

  return {

    examTitle: snapshot.title,

    subject: snapshot.subject,

    totalStudents,

    submitted,

    running,

    averageMarks,

    averagePercentage,

    highestMarks,

    lowestMarks,

    passPercentage,

    failPercentage,

  };

};


// =====================================
// TOP PERFORMERS
// =====================================

const getTopPerformers = async (snapshotId, limit) => {

  // Check Snapshot
  const snapshot = await TestSnapshot.findById(snapshotId);

  if (!snapshot) {
    throw new Error("Test snapshot not found.");
  }

  // Load Top Students
  const attempts = await ExamAttempt.find({
    testSnapshot: snapshotId,
    status: "submitted",
  })
    .populate({
      path: "student",
      select: "userId fullName email",
    })
    .sort({
      obtainedMarks: -1,
      timeTaken: 1,
    })
    .limit(limit);

  // Ranking
  return attempts.map((attempt, index) => ({

    rank: index + 1,

    studentId: attempt.student?._id,

    userId: attempt.student?.userId,

    fullName: attempt.student?.fullName,

    email: attempt.student?.email,

    obtainedMarks: attempt.obtainedMarks,

    totalMarks: attempt.totalMarks,

    percentage: attempt.percentage,

    timeTaken: attempt.timeTaken,

  }));

};
// =====================================
// WEAK STUDENTS
// =====================================

const getWeakStudents = async (snapshotId, limit) => {

  const snapshot = await TestSnapshot.findById(snapshotId);

  if (!snapshot) {
    throw new Error("Test snapshot not found.");
  }

  const attempts = await ExamAttempt.find({
    testSnapshot: snapshotId,
    status: "submitted",
    percentage: { $lt: PASS_PERCENTAGE },
  })
    .populate({
      path: "student",
      select: "userId fullName email",
    })
    .sort({
      percentage: 1,
      obtainedMarks: 1,
    })
    .limit(limit);

  return attempts.map((attempt, index) => ({

    rank: index + 1,

    studentId: attempt.student?._id,

    userId: attempt.student?.userId,

    fullName: attempt.student?.fullName,

    email: attempt.student?.email,

    obtainedMarks: attempt.obtainedMarks,

    totalMarks: attempt.totalMarks,

    percentage: attempt.percentage,

    timeTaken: attempt.timeTaken,

    status: "Fail",

  }));

};
module.exports = {
  getExamStatistics,
  getTopPerformers,
  getWeakStudents,
};