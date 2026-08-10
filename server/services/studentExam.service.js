const TestSnapshot = require("../models/TestSnapshot");
const ExamAttempt = require("../models/ExamAttempt");
const calculateExamStatus = require("../utils/examStatus");
const mongoose = require("mongoose");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const StudentAnswer = require("../models/StudentAnswer");
const {
  getExamDeadline,
  getRemainingTimeSeconds,
} = require("../utils/examTime");
const {
  validateSnapshot,
  validateExamWindow,
  validateStudent,
  validateAttempt,
  canResumeAttempt,
  initializeAnswers,
} = require("../utils/examValidation");
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
// ======================================
// CHECK EXAM EXPIRY
// ======================================

const checkExamExpiry = async (
  studentId,
  attempt,
  snapshot
) => {
  // --------------------------------------
  // 1. Validate Attempt
  // --------------------------------------

  if (!attempt) {
    throw new ApiError(
      404,
      "Exam attempt not found."
    );
  }

  // --------------------------------------
  // 2. Validate Snapshot
  // --------------------------------------

  if (!snapshot) {
    throw new ApiError(
      404,
      "Test snapshot not found."
    );
  }

  // --------------------------------------
  // 3. Verify Ownership
  // --------------------------------------

  if (
    attempt.student.toString() !==
    studentId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to access this exam."
    );
  }

  // --------------------------------------
  // 4. Already Submitted
  // --------------------------------------

  if (
    attempt.status === "SUBMITTED"
  ) {
    throw new ApiError(
      409,
      "Exam already submitted."
    );
  }

  // --------------------------------------
  // 5. Calculate Server-Side Deadline
  // --------------------------------------

  const deadline =
    getExamDeadline({
      startedAt: attempt.startedAt,
      endTime: snapshot.endTime,
      durationMinutes:
        snapshot.duration,
    });

  if (!deadline) {
    throw new ApiError(
      500,
      "Unable to determine exam deadline."
    );
  }

  // --------------------------------------
  // 6. Check Server Time
  // --------------------------------------

  if (new Date() < deadline) {
    return deadline;
  }

  // --------------------------------------
  // 7. Auto Submit
  // --------------------------------------

  await submitExam(
    studentId,
    attempt._id
  );

  // --------------------------------------
  // 8. Inform Caller
  // --------------------------------------

  throw new ApiError(
    409,
    "Exam time is over. Your exam has been submitted automatically."
  );
};
// ======================================
// SAVE ANSWER
// ======================================

const saveAnswer = async (
  studentId,
  attemptId,
  questionId,
  selectedAnswer,
  currentQuestionIndex
) => {
  // --------------------------------------
  // 1. Validate IDs
  // --------------------------------------

  if (
    !mongoose.Types.ObjectId.isValid(attemptId) ||
    !mongoose.Types.ObjectId.isValid(questionId)
  ) {
    throw new ApiError(
      400,
      "Invalid attempt or question ID."
    );
  }

  // --------------------------------------
  // 2. Validate Student ID
  // --------------------------------------

  if (!studentId) {
    throw new ApiError(
      401,
      "Authentication required."
    );
  }

  // --------------------------------------
  // 3. Validate Question Index
  // --------------------------------------

  if (
    !Number.isInteger(currentQuestionIndex) ||
    currentQuestionIndex < 0
  ) {
    throw new ApiError(
      400,
      "Invalid question index."
    );
  }

  // --------------------------------------
  // 4. Validate Selected Answer
  // --------------------------------------

  const validAnswers = ["A", "B", "C", "D"];

  if (!validAnswers.includes(selectedAnswer)) {
    throw new ApiError(
      400,
      "Invalid selected answer."
    );
  }

  // --------------------------------------
  // 5. Find Attempt
  // --------------------------------------

  const attempt = await ExamAttempt.findById(
    attemptId
  );

  if (!attempt) {
    throw new ApiError(
      404,
      "Exam attempt not found."
    );
  }

  // --------------------------------------
  // 6. Ownership Check
  // --------------------------------------

  if (
    attempt.student.toString() !==
    studentId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to modify this exam."
    );
  }

// --------------------------------------
// 7. Verify Attempt Status
// --------------------------------------

if (attempt.status === "SUBMITTED") {
  throw new ApiError(
    409,
    "Exam already submitted."
  );
}

if (attempt.status !== "IN-PROGRESS") {
  throw new ApiError(
    409,
    "Exam is not currently active."
  );
}
  // --------------------------------------
  // 8. Load Snapshot
  // --------------------------------------

  const snapshot =
    await TestSnapshot.findById(
      attempt.testSnapshot
    ).lean();

  if (!snapshot) {
    throw new ApiError(
      404,
      "Test snapshot not found."
    );
  }

  // --------------------------------------
  // 9. Check Exam Expiry
  const deadline =
    await checkExamExpiry(
      studentId,
      attempt,
      snapshot
    );

  // 10. Validate Question Index
  // --------------------------------------

  if (
    currentQuestionIndex >=
    snapshot.questions.length
  ) {
    throw new ApiError(
      400,
      "Invalid question index."
    );
  }

  // 11. Find Question From Snapshot
  
  const question =
    snapshot.questions.find(
      (item) =>
        item.questionId.toString() ===
        questionId.toString()
    );

  if (!question) {
    throw new ApiError(
      404,
      "Question does not belong to this exam."
    );
  }

  // 12. Verify Question Index Matches
  
  const questionAtIndex =
    snapshot.questions[
      currentQuestionIndex
    ];

  if (
    !questionAtIndex ||
    questionAtIndex.questionId.toString() !==
      questionId.toString()
  ) {
    throw new ApiError(
      400,
      "Question index does not match question."
    );
  }
  // 13. Calculate Answer
  const isCorrect =
    question.correctAnswer ===
    selectedAnswer;

  const marksAwarded = isCorrect
    ? Number(question.marks || 0)
    : 0;


  // 14. Upsert Student Answer

  const savedAnswer =
    await StudentAnswer.findOneAndUpdate(
      {
        attempt: attempt._id,
        questionId:
          question.questionId,
      },
      {
        $set: {
          selectedAnswer,
          correctAnswer:
            question.correctAnswer,
          isCorrect,
          marksAwarded,
          answeredAt: new Date(),
        },
        $setOnInsert: {
          attempt: attempt._id,
          questionId:
            question.questionId,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );


  // 15. Update Current Question
  
  attempt.currentQuestionIndex =
    currentQuestionIndex;


  // 16. Mark Question As Visited
  
  const alreadyVisited =
    Array.isArray(
      attempt.visitedQuestions
    ) &&
    attempt.visitedQuestions.some(
      (id) =>
        id.toString() ===
        question.questionId.toString()
    );

  if (!alreadyVisited) {
    attempt.visitedQuestions.push(
      question.questionId
    );
  }

  // 17. Save Attempt Progress
  await attempt.save();

  // 18. Return Safe Response
 
return {
  questionId:
    question.questionId,

  selectedAnswer:
    savedAnswer.selectedAnswer,

  currentQuestionIndex:
    attempt.currentQuestionIndex,

  answeredAt:
    savedAnswer.answeredAt,
};
};

module.exports = {

  getAvailableExams,

  startExam,

  saveAnswer,

};