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
] = await Promise.all([

  User.countDocuments(),

  Question.countDocuments(),

  Test.countDocuments(),

  Test.countDocuments({
    status: "published",
  }),

  Test.countDocuments({
    status: "draft",
  }),

  Test.find()
    .select("title subject status duration createdAt")
    .sort({ createdAt: -1 })
    .limit(5),

  Question.find()
    .select("question subject chapter difficulty marks createdAt")
    .sort({ createdAt: -1 })
    .limit(5),

  // Subject Analytics
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

]);
  return {


    totalUsers,
    totalQuestions,
    totalTests,
    publishedTests,
    draftTests,
    recentTests,
    recentQuestions,
    subjectAnalytics,
    monthlyAnalytics,


  };

};

module.exports = {
  getDashboardStats,
};