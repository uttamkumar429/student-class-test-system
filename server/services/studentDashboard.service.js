const User = require("../models/User");
const Test = require("../models/Test");
const ExamAttempt = require("../models/ExamAttempt");

const mongoose = require("mongoose");
const getDashboard = async (studentId) => {
  const now = new Date();

  const [
    student,
    availableExams,
    attemptedExams,
    recentResults,
    upcomingExams,
    averageScoreData,
  ] = await Promise.all([
    // Student Info
    User.findById(studentId)
      .select("fullName email profilePhoto")
      .lean(),

    // Available Exams
    Test.countDocuments({
      status: "published",
      startTime: { $lte: now },
      endTime: { $gte: now },
    }),

    // Attempted Exams
    ExamAttempt.countDocuments({
      student: studentId,
      status: "SUBMITTED",
    }),

    // Recent Results
    ExamAttempt.find({
      student: studentId,
      status: "SUBMITTED",
    })
      .populate({
        path: "testSnapshot",
        select: "title subject",
      })
      .sort({ submittedAt: -1 })
      .limit(5)
      .lean(),

    // Upcoming Exams
    Test.find({
      status: "published",
      startTime: { $gte: now },
    })
      .select(
        "title subject duration totalMarks totalQuestions startTime endTime"
      )
      .sort({ startTime: 1 })
      .limit(5)
      .lean(),

    // Average Score
    ExamAttempt.aggregate([
      {
        $match: {
          student: new mongoose.Types.ObjectId(studentId),
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

  return {
    student,

    stats: {
      availableExams,
      attemptedExams,
      averageScore:
        averageScoreData.length > 0
          ? Number(
              averageScoreData[0].averageScore.toFixed(2)
            )
          : 0,
    },

    upcomingExams,

    recentResults,
  };
};

module.exports = {
  getDashboard,
};