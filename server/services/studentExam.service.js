const TestSnapshot = require("../models/TestSnapshot");
const ExamAttempt = require("../models/ExamAttempt");

const calculateExamStatus = require("../utils/examStatus");
// =====================================
// GET AVAILABLE EXAMS
// =====================================

const getAvailableExams = async (
  studentId,
  page = 1,
  limit = 10,
  search = "",
  subject = "",
  sort = "newest"
) => {

  page = Math.max(1, Number(page));
  limit = Math.min(100, Math.max(1, Number(limit)));

  const skip = (page - 1) * limit;

  // =====================================
  // FILTER
  // =====================================

    const filter = {
        publishedAt: {
            $exists: true,
        },
    };

  if (subject) {
    filter.subject = subject;
  }

  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        subject: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // =====================================
  // SORT
  // =====================================

  let sortOption = {};

  switch (sort) {

    case "oldest":
      sortOption = {
        publishedAt: 1,
      };
      break;

    case "title":
      sortOption = {
        title: 1,
      };
      break;

    case "subject":
      sortOption = {
        subject: 1,
      };
      break;

    default:
      sortOption = {
        publishedAt: -1,
      };

  }

  // =====================================
  // FETCH SNAPSHOTS
  // =====================================

  const [total, snapshots] = await Promise.all([

    TestSnapshot.countDocuments(filter),

    TestSnapshot.find(filter)
      .select(
        "title subject duration totalMarks totalQuestions startTime endTime publishedAt"
      )
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),

  ]);

  // =====================================
  // SNAPSHOT IDS
  // =====================================

  const snapshotIds = snapshots.map(
    (snapshot) => snapshot._id
  );

  // =====================================
  // FETCH ATTEMPTS
  // =====================================

  const attempts = await ExamAttempt.find({

    student: studentId,

    testSnapshot: {
      $in: snapshotIds,
    },

  })
    .select(
      "testSnapshot status"
    )
    .lean();

  // =====================================
  // MAP
  // =====================================

  const attemptMap = new Map();

  attempts.forEach((attempt) => {

    attemptMap.set(
      attempt.testSnapshot.toString(),
      attempt
    );

  });

  // =====================================
  // RESPONSE
  // =====================================

  const exams = snapshots.map((snapshot) => {

    const attempt =
      attemptMap.get(snapshot._id.toString());

    const examStatus =
      calculateExamStatus(
        snapshot,
        attempt
      );

    return {

      _id: snapshot._id,

      title: snapshot.title,

      subject: snapshot.subject,

      duration: snapshot.duration,

      totalMarks: snapshot.totalMarks,

      totalQuestions: snapshot.totalQuestions,

      startTime: snapshot.startTime,

      endTime: snapshot.endTime,

      status: examStatus.status,

      attempted: examStatus.attempted,

    };

  });

  return {

    total,

    page,

    limit,

    totalPages:
      Math.ceil(total / limit),

    exams,

  };

};
// =====================================
// START EXAM
// =====================================

const startExam = async (
  studentId,
  testId
) => {

  // =====================================
  // FIND SNAPSHOT
  // =====================================

  const snapshot =
    await TestSnapshot.findOne({
      testId,
    }).lean();

  if (!snapshot) {
    throw new ApiError(
      404,
      "Published test not found."
    );
  }

  // =====================================
  // CHECK EXISTING ATTEMPT
  // =====================================

  const existingAttempt =
    await ExamAttempt.findOne({

      student: studentId,

      testSnapshot: snapshot._id,

    });

  // =====================================
  // ALREADY SUBMITTED
  // =====================================

  if (
    existingAttempt &&
    existingAttempt.status ===
      "SUBMITTED"
  ) {
    throw new ApiError(
      409,
      "You have already submitted this exam."
    );
  }

  // =====================================
  // RESUME EXAM
  // =====================================

  if (existingAttempt) {

    return {

      isResume: true,

      attemptId:
        existingAttempt._id,

      currentQuestion:
        existingAttempt.currentQuestionIndex,

      snapshot,

    };

  }

  // =====================================
  // CREATE NEW ATTEMPT
  // =====================================

  const attempt =
    await ExamAttempt.create({

      student: studentId,

      testSnapshot: snapshot._id,

      totalQuestions:
        snapshot.totalQuestions,

      totalMarks:
        snapshot.totalMarks,

      currentQuestionIndex: 0,

      status: "IN-PROGRESS",

    });

  return {

    isResume: false,

    attemptId: attempt._id,

    currentQuestion: 0,

    snapshot,

  };

};
