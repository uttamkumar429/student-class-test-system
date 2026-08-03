const User = require("../models/User");
const Question = require("../models/Question");
const Test = require("../models/Test");
const ExamAttempt = require("../models/ExamAttempt");

const getDashboard = async () => {
  const today = new Date();

  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const [
    totalStudents,
    activeStudents,
    blockedStudents,
    totalTeachers,
    totalQuestions,
    publishedTests,
    draftTests,
    completedTests,
    todayAttempts,
    totalAttempts,
  ] = await Promise.all([

    User.countDocuments({
      role: "student",
    }),

    User.countDocuments({
      role: "student",
      isBlocked: false,
    }),

    User.countDocuments({
      role: "student",
      isBlocked: true,
    }),

    User.countDocuments({
      role: "teacher",
    }),

    Question.countDocuments(),

    Test.countDocuments({
      status: "published",
    }),

    Test.countDocuments({
      status: "draft",
    }),

    Test.countDocuments({
      status: "completed",
    }),

    ExamAttempt.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }),

    ExamAttempt.countDocuments(),

  ]);

  return {
    totalStudents,
    activeStudents,
    blockedStudents,
    totalTeachers,

    totalQuestions,

    publishedTests,
    draftTests,
    completedTests,

    todayAttempts,
    totalAttempts,
  };
};

module.exports = {
  getDashboard,
};