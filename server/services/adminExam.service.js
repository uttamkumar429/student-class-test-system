const ExamAttempt = require("../models/ExamAttempt");
const TestSnapshot = require("../models/TestSnapshot");
const StudentAnswer = require("../models/StudentAnswer");

// =====================================
// EXAM MONITORING
// =====================================
const getExamMonitoring = async (snapshotId) => {

  // Find Snapshot
  const snapshot = await TestSnapshot.findById(snapshotId)
    .select("title subject")
    .lean();

  if (!snapshot) {
    throw new ApiError(
      404,
      "Test snapshot not found."
    );
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
  const snapshot = await TestSnapshot.findById(snapshotId)
    .select("_id")
    .lean();

  if (!snapshot) {
    throw new ApiError(
      404,
      "Test snapshot not found."
    );
  }

  // Load Attempts
  const attempts = await ExamAttempt.find({
    testSnapshot: snapshotId,
  })
    .populate({
      path: "student",
      select: "userId fullName email phone isBlocked",
    })
    .sort({ createdAt: -1 })
    .lean();

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

// =====================================
// ATTEMPT DETAILS
// =====================================
const getAttemptDetails = async (snapshotId, attemptId) => {

  // Check Snapshot
  const snapshot = await TestSnapshot.findById(snapshotId)
    .select("title subject questions")
    .lean();

  if (!snapshot) {
    throw new ApiError(
      404,
      "Test snapshot not found."
    );
  }

  // Load Attempt
  const attempt = await ExamAttempt.findById(attemptId)
    .populate({
      path: "student",
      select: "userId fullName email",
    });

  if (!attempt) {
    throw new ApiError(
      404,
      "Test snapshot not found."
    );
  }

  // Check attempt belongs to snapshot
  if (attempt.testSnapshot.toString() !== snapshotId) {
    throw new Error("Attempt does not belong to this test.");
  }

  // Load Answers
  const answers = await StudentAnswer.find({
    attempt: attemptId,
  });

  // Merge Question + Answer
  const questions = snapshot.questions.map((question) => {

    const answer = answers.find(
      (a) =>
        a.questionId.toString() ===
        question.questionId.toString()
    );

    return {
      questionId: question.questionId,
      question: question.question,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      selectedAnswer: answer?.selectedAnswer || null,
      correctAnswer: question.correctAnswer,
      isCorrect: answer?.isCorrect || false,
      marksAwarded: answer?.marksAwarded || 0,
    };

  });

  return {

    student: {
      userId: attempt.student.userId,
      fullName: attempt.student.fullName,
      email: attempt.student.email,
    },

    exam: {
      title: snapshot.title,
      subject: snapshot.subject,
    },

    summary: {
      obtainedMarks: attempt.obtainedMarks,
      totalMarks: attempt.totalMarks,
      percentage: attempt.percentage,
      timeTaken: attempt.timeTaken,
      status: attempt.status,
    },

    questions,

  };

};

module.exports = {
  getExamMonitoring,
  getStudentAttempts,
  getAttemptDetails,
};