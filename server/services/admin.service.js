const User = require("../models/User");
const Question = require("../models/Question");
const Test = require("../models/Test");
const TestSnapshot = require("../models/TestSnapshot");
const ExamAttempt = require("../models/ExamAttempt");

const getDashboard = async () => {

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const [

    // ==========================
    // USERS
    // ==========================

    totalStudents,

    activeStudents,

    blockedStudents,

    totalTeachers,

    // ==========================
    // QUESTIONS
    // ==========================

    totalQuestions,

    // ==========================
    // TESTS
    // ==========================

    totalTests,

    publishedTests,

    draftTests,

    archivedTests,

    completedTests,

    // ==========================
    // SNAPSHOTS
    // ==========================

    totalPublishedExams,

    // ==========================
    // ATTEMPTS
    // ==========================

    totalAttempts,

    todayAttempts,

    // ==========================
    // RECENT
    // ==========================

    recentTests,

    recentQuestions,

  ] = await Promise.all([

    // --------------------------------
    // Students
    // --------------------------------

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
      role: {
        $in: [
          "teacher",
          "admin",
          "superAdmin",
        ],
      },
    }),

    // --------------------------------
    // Questions
    // --------------------------------

    Question.countDocuments(),

    // --------------------------------
    // Tests
    // --------------------------------

    Test.countDocuments(),

    Test.countDocuments({
      status: "published",
    }),

    Test.countDocuments({
      status: "draft",
    }),

    Test.countDocuments({
      status: "archived",
    }),

    Test.countDocuments({
      status: "completed",
    }),

    // --------------------------------
    // Published Exams
    // --------------------------------

    TestSnapshot.countDocuments(),

    // --------------------------------
    // Attempts
    // --------------------------------

    ExamAttempt.countDocuments(),

    ExamAttempt.countDocuments({
      createdAt: {
        $gte: today,
      },
    }),

    // --------------------------------
    // Recent Tests
    // --------------------------------

    Test.find()

      .select(
        "title subject duration status createdAt createdBy startTime"
      )

      .populate(
        "createdBy",
        "fullName"
      )

      .sort({
        createdAt: -1,
      })

      .limit(5)

      .lean(),

    // --------------------------------
    // Recent Questions
    // --------------------------------

    Question.find()

      .select(
        "question subject chapter difficulty marks createdAt"
      )

      .sort({
        createdAt: -1,
      })

      .limit(5)

      .lean(),

  ]);
    // ==========================================
  // ANALYTICS
  // ==========================================

  const [

    subjectAnalytics,

    monthlyAnalytics,

    difficultyAnalytics,

    questionSubjectAnalytics,

    testStatusAnalytics,

    upcomingTests,

    recentActivities,

  ] = await Promise.all([

    // ======================================
    // TEST SUBJECT ANALYTICS
    // ======================================

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

    // ======================================
    // MONTHLY TEST ANALYTICS
    // ======================================

    Test.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },
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
          year: "$_id.year",
          month: "$_id.month",
          totalTests: 1,
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
        },
      },
    ]),

    // ======================================
    // QUESTION DIFFICULTY
    // ======================================

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

    // ======================================
    // QUESTION SUBJECTS
    // ======================================

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

    // ======================================
    // TEST STATUS
    // ======================================

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

    // ======================================
    // UPCOMING TESTS
    // ======================================

    TestSnapshot.find({

      startTime: {
        $gte: new Date(),
      },

      endTime: {
        $gte: new Date(),
      },

    })

      .select(
        "title subject duration startTime"
      )

      .sort({
        startTime: 1,
      })

      .limit(5)

      .lean(),

    // ======================================
    // RECENT ACTIVITIES
    // ======================================

    ExamAttempt.find()

      .populate(
        "student",
        "fullName"
      )

      .populate(
        "testSnapshot",
        "title"
      )

      .sort({
        updatedAt: -1,
      })

      .limit(10)

      .lean(),

  ]);
    // ==========================================
  // FORMAT UPCOMING TESTS
  // ==========================================

  const formattedUpcomingTests = upcomingTests.map(
    (test) => ({
      id: test._id,
      title: test.title,
      subject: test.subject,
      duration: test.duration,
      startTime: test.startTime,
    })
  );

  // ==========================================
  // FORMAT RECENT ACTIVITIES
  // ==========================================

  const formattedActivities = recentActivities.map(
    (attempt) => ({

      id: attempt._id,

      type:
        attempt.status === "SUBMITTED"
          ? "submit"
          : "start",

      title:
        attempt.student?.fullName ||
        "Unknown Student",

      description:
        `${attempt.status === "SUBMITTED"
          ? "Submitted"
          : "Started"} ${attempt.testSnapshot?.title || "Exam"}`,

      time: attempt.updatedAt,

    })
  );

  // ==========================================
  // RETURN
  // ==========================================

  return {

    // -----------------------
    // Overview
    // -----------------------

    totalStudents,

    activeStudents,

    blockedStudents,

    totalTeachers,

    totalQuestions,

    totalTests,

    publishedTests,

    draftTests,

    archivedTests,

    completedTests,

    totalPublishedExams,

    totalAttempts,

    todayAttempts,

    // -----------------------
    // Recent
    // -----------------------

    recentTests,

    recentQuestions,

    upcomingTests:
      formattedUpcomingTests,

    recentActivities:
      formattedActivities,

    // -----------------------
    // Analytics
    // -----------------------

    analytics: {

      subjectAnalytics,

      monthlyAnalytics,

      difficultyAnalytics,

      questionSubjectAnalytics,

      testStatusAnalytics,

    },

  };

};

// ==========================================
// EXPORT
// ==========================================

module.exports = {

  getDashboard,

};