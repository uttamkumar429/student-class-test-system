const ExamAttempt = require("../models/ExamAttempt");
const TestSnapshot = require("../models/TestSnapshot");

// =====================================
// EXAM MONITORING
// =====================================
const getExamMonitoring = async (snapshotId) => {

  // Find Snapshot
  const snapshot = await TestSnapshot.findById(snapshotId);

  if (!snapshot) {
    throw new Error("Test snapshot not found.");
  }

  // Total Attempts
  const totalAttempts = await ExamAttempt.countDocuments({
    testSnapshot: snapshotId,
  });

  // Running Exams
  const running = await ExamAttempt.countDocuments({
    testSnapshot: snapshotId,
    status: "in-progress",
  });

  // Submitted Exams
  const submitted = await ExamAttempt.countDocuments({
    testSnapshot: snapshotId,
    status: "submitted",
  });

  return {
    examTitle: snapshot.title,
    subject: snapshot.subject,
    totalAttempts,
    running,
    submitted,
  };
};


// =====================================
// STUDENT ATTEMPT LIST
// =====================================
const getStudentAttempts = async (snapshotId) => {

  // Snapshot Exists?
  const snapshot = await TestSnapshot.findById(snapshotId);

  if (!snapshot) {
    throw new Error("Test snapshot not found.");
  }

  // Load Attempts
  const attempts = await ExamAttempt.find({
    testSnapshot: snapshotId,
  })
    .populate({
      path: "student",
      select: "userId fullName email phone isBlocked",
    })
    .sort({ createdAt: -1 });

  return attempts.map((attempt) => ({

    attemptId: attempt._id,

    studentId: attempt.student?._id,

    userId: attempt.student?.userId,

    fullName: attempt.student?.fullName,

    email: attempt.student?.email,

    phone: attempt.student?.phone,

    isBlocked: attempt.student?.isBlocked,

    status: attempt.status,

    obtainedMarks: attempt.obtainedMarks,

    totalMarks: attempt.totalMarks,

    percentage: attempt.percentage,

    timeTaken: attempt.timeTaken,

    startedAt: attempt.startedAt,

    submittedAt: attempt.submittedAt,

  }));

};
module.exports = {
  getExamMonitoring,
  getStudentAttempts,
};