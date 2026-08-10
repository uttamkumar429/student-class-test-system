const mongoose = require("mongoose");

const User = require("../models/User");
const TestSnapshot = require("../models/TestSnapshot");
const ExamAttempt = require("../models/ExamAttempt");
const ApiError = require("../utils/ApiError");

const getDashboard = async (studentId) => {
  if (!mongoose.isValidObjectId(studentId)) {
    throw new ApiError(400, "Invalid student ID.");
  }

  const studentObjectId = new mongoose.Types.ObjectId(studentId);
  const now = new Date();

  // --------------------------------------------------
  // STUDENT
  // --------------------------------------------------

  const student = await User.findById(studentObjectId)
    .select("fullName email profilePhoto profileCompleted")
    .lean();

  if (!student) {
    throw new ApiError(404, "Student not found.");
  }

  // --------------------------------------------------
  // FIND EXAMS ALREADY SUBMITTED BY THIS STUDENT
  // --------------------------------------------------

  const submittedAttempts = await ExamAttempt.find({
    student: studentObjectId,
    status: "SUBMITTED",
  })
    .select(
      "_id testSnapshot obtainedMarks totalMarks percentage submittedAt"
    )
    .populate({
      path: "testSnapshot",
      select: "title subject",
    })
    .sort({ submittedAt: -1 })
    .limit(10)
    .lean();

  const submittedSnapshotIds = submittedAttempts
    .map((attempt) => attempt.testSnapshot?._id)
    .filter(Boolean);

  // --------------------------------------------------
  // UPCOMING EXAMS
  // --------------------------------------------------

  const upcomingQuery = {
    startTime: { $gt: now },
  };

  if (submittedSnapshotIds.length > 0) {
    upcomingQuery._id = {
      $nin: submittedSnapshotIds,
    };
  }

  // --------------------------------------------------
  // ACTIVE EXAMS
  // --------------------------------------------------

  const activeQuery = {
    startTime: { $lte: now },
    endTime: { $gte: now },
  };

  if (submittedSnapshotIds.length > 0) {
    activeQuery._id = {
      $nin: submittedSnapshotIds,
    };
  }

  const [
  upcoming,
  active,
  upcomingCount,
  activeCount,
  completedCount,
  averageScoreData,
] = await Promise.all([
  TestSnapshot.find(upcomingQuery)
    .select(
      "_id title subject duration totalMarks totalQuestions startTime endTime"
    )
    .sort({ startTime: 1 })
    .limit(5)
    .lean(),

  TestSnapshot.find(activeQuery)
    .select(
      "_id title subject duration totalMarks totalQuestions startTime endTime"
    )
    .sort({ startTime: 1 })
    .limit(5)
    .lean(),

  TestSnapshot.countDocuments(upcomingQuery),

  TestSnapshot.countDocuments(activeQuery),

  ExamAttempt.countDocuments({
    student: studentObjectId,
    status: "SUBMITTED",
  }),

  ExamAttempt.aggregate([
    {
      $match: {
        student: studentObjectId,
        status: "SUBMITTED",
      },
    },
    {
      $group: {
        _id: null,
        averageScore: {
          $avg: "$percentage",
        },
      },
    },
  ]),
]);
  // --------------------------------------------------
  // RECENT RESULTS
  // --------------------------------------------------

  const recentResults = submittedAttempts
    .slice(0, 5)
    .map((attempt) => ({
      attemptId: attempt._id,

      examTitle:
        attempt.testSnapshot?.title ||
        "Unknown Exam",

      subject:
        attempt.testSnapshot?.subject ||
        "Unknown Subject",

      obtainedMarks:
        attempt.obtainedMarks || 0,

      totalMarks:
        attempt.totalMarks || 0,

      percentage:
        attempt.percentage || 0,

      submittedAt:
        attempt.submittedAt,
    }));

  // --------------------------------------------------
  // PERFORMANCE
  // --------------------------------------------------

  const performance = submittedAttempts
    .slice(0, 6)
    .reverse()
    .map((attempt) => ({
      exam:
        attempt.testSnapshot?.subject ||
        attempt.testSnapshot?.title ||
        "Exam",

      score:
        Number(attempt.percentage || 0),
    }));


  // --------------------------------------------------
  // AVERAGE SCORE
  // --------------------------------------------------

  const averageScore =
    averageScoreData.length > 0
      ? Number(
          Number(
            averageScoreData[0].averageScore || 0
          ).toFixed(2)
        )
      : 0;

  // --------------------------------------------------
  // FINAL RESPONSE
  // --------------------------------------------------

  return {
    student,

  stats: {
    availableExams: upcomingCount + activeCount,

    activeExams: activeCount,

    completedExams: completedCount,

    averageScore,
  },

    upcoming,

    active,

    recentResults,

    performance,
  };
};

module.exports = {
  getDashboard,
};