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

module.exports = {
  getExamMonitoring,
};