const User = require("../models/User");
const Question = require("../models/Question");
const Test = require("../models/Test");

const getDashboardStats = async () => {

  const [
    totalUsers,
    totalQuestions,
    totalTests,
    publishedTests,
    draftTests,
    recentTests,
    recentQuestions,
    subjectAnalytics,
    monthlyAnalytics,
    difficultyAnalytics,
    questionSubjectAnalytics,
    testStatusAnalytics,
  ] = await Promise.all([

    // Total Users
    User.countDocuments(),

    // Total Questions
    Question.countDocuments(),

    // Total Tests
    Test.countDocuments(),

    // Published Tests
    Test.countDocuments({
      status: "published",
    }),

    // Draft Tests
    Test.countDocuments({
      status: "draft",
    }),

    // Recent Tests
    Test.find()
      .select("title subject duration status createdAt")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    // Recent Questions
    Question.find()
      .select("question subject chapter difficulty marks createdAt")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    // Test Subject Analytics
    Test.aggregate([
      {
        $group: {
          _id: "$subject",
          totalTests: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          subject: "$_id",
          totalTests: 1,
        },
      },
      {
        $sort: {
          totalTests: -1,
        },
      },
    ]),

    // Monthly Analytics
    Test.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          totalTests: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          totalTests: 1,
        },
      },
      {
        $sort: {
          month: 1,
        },
      },
    ]),

    // Difficulty Analytics
    Question.aggregate([
      {
        $group: {
          _id: "$difficulty",
          totalQuestions: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          difficulty: "$_id",
          totalQuestions: 1,
        },
      },
      {
        $sort: {
          totalQuestions: -1,
        },
      },
    ]),

    // Question Subject Analytics
    Question.aggregate([
      {
        $group: {
          _id: "$subject",
          totalQuestions: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          subject: "$_id",
          totalQuestions: 1,
        },
      },
      {
        $sort: {
          totalQuestions: -1,
        },
      },
    ]),

    // Test Status Analytics
    Test.aggregate([
      {
        $group: {
          _id: "$status",
          totalTests: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          totalTests: 1,
        },
      },
      {
        $sort: {
          totalTests: -1,
        },
      },
    ]),

  ]);

  return {

    overview: {

      totalUsers,

      totalQuestions,

      totalTests,

      publishedTests,

      draftTests,

    },

    recent: {

      recentTests,

      recentQuestions,

    },

    analytics: {

      subjectAnalytics,

      monthlyAnalytics,

      difficultyAnalytics,

      questionSubjectAnalytics,

      testStatusAnalytics,

    },

  };
};

module.exports = {
  getDashboardStats,
};