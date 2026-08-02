const ExamAttempt = require("../models/ExamAttempt");
const TestSnapshot = require("../models/TestSnapshot");
const StudentAnswer = require("../models/StudentAnswer");
const ApiError = require("../utils/ApiError");
const { PASS_PERCENTAGE } = require("../config/constants");
// ==========================================
// STUDENT DASHBOARD
// ==========================================
const getDashboard = async () => {

  const now = new Date();

  const upcoming = await TestSnapshot.find({
    startTime: { $gt: now }
  })
    .select(
      "title subject duration totalMarks totalQuestions startTime endTime"
    )
    .sort({ startTime: 1 })
    .lean();

  const active = await TestSnapshot.find({
    startTime: { $lte: now },
    endTime: { $gte: now }
  })
    .select(
      "title subject duration totalMarks totalQuestions startTime endTime"
    )
    .sort({ startTime: 1 })
    .lean();

  const completed = await TestSnapshot.find({
    endTime: { $lt: now }
  })
    .select(
      "title subject duration totalMarks totalQuestions startTime endTime"
    )
    .sort({ endTime: -1 })
    .lean();

  return {
    upcoming,
    active,
    completed,
  };

};
// ==========================================
// AVAILABLE EXAMS
// ==========================================
const getAvailableExams = async () => {

  const now = new Date();

  const exams = await TestSnapshot.find({
    endTime: { $gte: now },
  })
    .sort({ startTime: 1 })
    .select(
      "title subject duration totalMarks totalQuestions startTime endTime"
    )
    .lean();

  return exams.map((exam) => ({
    ...exam,
    status: exam.startTime <= now ? "ACTIVE" : "UPCOMING",
  }));
};

// START EXAM
// =====================================
const startExam = async (studentId, snapshotId) => {

  // Find Snapshot
  const snapshot = await TestSnapshot.findById(snapshotId)
  .select(
  "_id startTime endTime totalQuestions totalMarks"
  )
  .lean();

  if (!snapshot) {
  throw new ApiError(
      404,
      "Test not found."
  )
  }

  const now = new Date();

  // Check Exam Time
  if (now < snapshot.startTime) {
    throw new ApiError(
      400,
      "Exam has not started yet."
    );
  }

  if (now > snapshot.endTime) {
  throw new ApiError(
      409,
      "Exam has already ended."
  );
  }

  // Check Existing Attempt
  const existingAttempt = await ExamAttempt.findOne({
    student: studentId,
    testSnapshot: snapshotId,
  });

  if (existingAttempt) {

    if (existingAttempt.status === "IN-PROGRESS") {
      return existingAttempt;
    }

    throw new ApiError(
      400,
      "Exam already submitted."
    );
  }

  // Create Attempt
  const attempt = await ExamAttempt.create({

    student: studentId,

    testSnapshot: snapshotId,

    totalQuestions: snapshot.totalQuestions,

    totalMarks: snapshot.totalMarks,

  });

  return attempt;

};
// ======================================
// CHECK EXAM EXPIRY
// ======================================

const checkExamExpiry = async (
  studentId,
  attempt,
  snapshot
) => {

  const now = new Date();

  if (now > snapshot.endTime) {

    await submitExam(
      studentId,
      attempt._id
    );

    throw new ApiError(409,
      "Exam time is over. Your exam has been submitted automatically."
    );

  }

};
// =====================================
// GET EXAM QUESTIONS
// =====================================
const getExamQuestions = async (studentId, attemptId) => {

  // Find Attempt
  const attempt = await ExamAttempt.findById(attemptId)
  .select(
  "student status testSnapshot"
  );

  if (!attempt) {
    throw new ApiError(404,"Exam attempt not found.");
  }

  // Security Check
  if (attempt.student.toString() !== studentId.toString()) {
    throw new ApiError(401,"Unauthorized access.");
  }

  // Already Submitted?
  if (attempt.status === "SUBMITTED") {
    throw new ApiError(409,"Exam already submitted.");
  }

  // Load Snapshot
  const snapshot = await TestSnapshot.findById(
  attempt.testSnapshot
  )
  .select(
  "title questions endTime"
  )
  .lean();

  if (!snapshot) {
    throw new ApiError(404,"Test snapshot not found.");
  }
  // =====================================
  // AUTO SUBMIT IF EXAM TIME IS OVER
  // =====================================

  await checkExamExpiry(
    studentId,
    attempt,
    snapshot
  );
  // Secure Questions
  const questions = snapshot.questions.map((question) => ({

    questionId: question.questionId,

    subject: question.subject,

    chapter: question.chapter,

    difficulty: question.difficulty,

    question: question.question,

    optionA: question.optionA,

    optionB: question.optionB,

    optionC: question.optionC,

    optionD: question.optionD,

    marks: question.marks

  }));

  return {
    attemptId: attempt._id,
    questions,
  };

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

  // Check Attempt

  const attempt = await ExamAttempt.findById(attemptId);

  if (!attempt) {

    throw new ApiError(404,"Exam attempt not found.");

  }

  // Ownership Check

  if (attempt.student.toString() !== studentId.toString()) {

    throw new ApiError(401,"Unauthorized access.");

  }

  // Already Submitted?

  if (attempt.status ==="SUBMITTED") {

    throw new ApiError(409,"Exam already submitted.");

  }

  // Load Snapshot

  const snapshot = await TestSnapshot.findById(
    attempt.testSnapshot
  );

  if (!snapshot) {

    throw new ApiError(404,"Snapshot not found.");

  }
    // ======================================
  // AUTO SUBMIT IF TIME IS OVER
  // ======================================

  await checkExamExpiry(
    studentId,
    attempt,
    snapshot
  );

  // Find Question

 const question = snapshot.questions.find(

    (q) => q.questionId.toString() === questionId

);


  if (!question) {

    throw new ApiError(404,"Question not found.");

  }

  // Correct?

  const isCorrect =
    question.correctAnswer === selectedAnswer;

  // Already Saved?

  const existingAnswer = await StudentAnswer.findOne({

    attempt: attemptId,

    questionId,

  });


let savedAnswer;

if (existingAnswer) {

    existingAnswer.selectedAnswer = selectedAnswer;
    existingAnswer.correctAnswer = question.correctAnswer;
    existingAnswer.isCorrect = isCorrect;
    existingAnswer.marksAwarded = isCorrect ? question.marks : 0;

    await existingAnswer.save();

    savedAnswer = existingAnswer;

} else {

    savedAnswer = await StudentAnswer.create({
        attempt: attemptId,
        questionId,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        marksAwarded: isCorrect ? question.marks : 0,
    });

}
if (
  currentQuestionIndex < 0 ||
  currentQuestionIndex >= snapshot.questions.length
) {
  throw new ApiError(400,"Invalid question index.");
}


attempt.currentQuestionIndex = currentQuestionIndex;

const alreadyVisited = attempt.visitedQuestions.some(
  (id) => id.toString() === questionId.toString()
);

if (!alreadyVisited) {
  attempt.visitedQuestions.push(questionId);
}

await attempt.save();

return savedAnswer;



};
// ======================================
// RESUME EXAM
// ======================================

const resumeExam = async (studentId) => {

  // Find Running Attempt
  const attempt = await ExamAttempt.findOne({
  student: studentId,
  status:"IN-PROGRESS"
  })
  .select(
    "_id totalQuestions status testSnapshot currentQuestionIndex visitedQuestions reviewQuestions"
  );
  if (!attempt) {
    throw new ApiError(404,"No running exam found.");
  }

  // Load Snapshot
  const snapshot = await TestSnapshot.findById(
  attempt.testSnapshot
  )
  .select(
  "_id title subject endTime"
  )
  .lean();

  if (!snapshot) {
    throw new ApiError(404,"Test snapshot not found.");
  }

  // Remaining Time
  const now = new Date();

  const remainingTime = Math.max(
    0,
    Math.floor((snapshot.endTime - now) / 1000)
  );
  await checkExamExpiry(
    studentId,
    attempt,
    snapshot
  );
  // Count Saved Answers
  const answeredQuestions =
    await StudentAnswer.countDocuments({
      attempt: attempt._id,
    });

    return {
      attemptId: attempt._id,
      snapshotId: snapshot._id,
      title: snapshot.title,
      subject: snapshot.subject,

      totalQuestions: attempt.totalQuestions,
      answeredQuestions: answeredQuestions,

      currentQuestionIndex: attempt.currentQuestionIndex,
      visitedQuestions: attempt.visitedQuestions,
      reviewQuestions: attempt.reviewQuestions,

      remainingTime: remainingTime,
      status: attempt.status,
    };

  };

// SUBMIT EXAM
// ======================================
const submitExam = async (studentId, attemptId) => {

  // Find Attempt
  const attempt = await ExamAttempt.findById(attemptId);

  if (!attempt) {
    throw new ApiError(404,"Exam attempt not found.");
  }

  // Security Check
  if (attempt.student.toString() !== studentId.toString()) {
    throw new ApiError(401,"Unauthorized access.");
  }

  // Already Submitted?
  if (attempt.status === "SUBMITTED") {
    throw new ApiError(409,"Exam already submitted.");
  }

  // Load Answers
  const answers = await StudentAnswer.find({
  attempt:attemptId
  })
  .select("marksAwarded");

  // Calculate Score
  const obtainedMarks = answers.reduce(
    (total, answer) => total + answer.marksAwarded,
    0
  );

  // Percentage
  const percentage =
    attempt.totalMarks > 0
      ? Number(
          ((obtainedMarks / attempt.totalMarks) * 100).toFixed(2)
        )
      : 0;

  // Time Taken (Minutes)
  const submittedAt = new Date();

  const timeTaken = Math.floor(
      (submittedAt - attempt.startedAt) / 1000
  );
  // Update Attempt
  attempt.obtainedMarks = obtainedMarks;
  attempt.percentage = percentage;
  attempt.timeTaken = timeTaken;
  attempt.submittedAt = submittedAt;
  attempt.status = "SUBMITTED";

await attempt.save();

console.log("===== AFTER SAVE =====");
console.log("Attempt ID :", attempt._id.toString());
console.log("Status     :", attempt.status);

return {
    attemptId: attempt._id,
    status: attempt.status,
    obtainedMarks,
    totalMarks: attempt.totalMarks,
    percentage,
    timeTaken,
    submittedAt,
  };

};
// ======================================
// GET RESULT
// ======================================
const getResult = async (studentId, attemptId) => {

  // Find Attempt
  const attempt = await ExamAttempt.findById(attemptId);

  if (!attempt) {
    throw new ApiError(404,"Exam attempt not found.");
  }

  // Security Check
  if (attempt.student.toString() !== studentId.toString()) {
    throw new ApiError(401,"Unauthorized access.");
  }

  // Result only after submission
  if (attempt.status !== "SUBMITTED") {
    throw new ApiError(400,"Exam is not submitted yet.");
  }

  // Load Snapshot
  const snapshot = await TestSnapshot.findById(
  attempt.testSnapshot
  )
  .select(
  "title subject"
  )
  .lean();

  if (!snapshot) {
    throw new ApiError(404,"Test snapshot not found.");
  }

  // Load Answers
  const answers = await StudentAnswer.find({
  attempt:attemptId
  })
  .select("isCorrect");

  const correctAnswers = answers.filter(
    (answer) => answer.isCorrect
  ).length;

  const wrongAnswers = answers.filter(
    (answer) => answer.isCorrect === false
  ).length;

  const skippedAnswers =
    attempt.totalQuestions - answers.length;
  const status =
      attempt.percentage >= PASS_PERCENTAGE
        ? "Pass"
        : "Fail"
  return {
      attemptId: attempt._id,

      examTitle: snapshot.title,

      subject: snapshot.subject,

      totalQuestions: attempt.totalQuestions,

      answeredQuestions: answers.length,

      correctAnswers,

      wrongAnswers,

      skippedAnswers,

      obtainedMarks: attempt.obtainedMarks,

      totalMarks: attempt.totalMarks,

      percentage: attempt.percentage,

      status,

      timeTaken: attempt.timeTaken,

      submittedAt: attempt.submittedAt,
    };
  };
// ======================================
// GET RESULT HISTORY
// ======================================
const getResultHistory = async (studentId) => {

  // Load Submitted Attempts
  const attempts = await ExamAttempt.find({
    student: studentId,
    status: "SUBMITTED",
  })
    .populate({
      path: "testSnapshot",
      select: "title subject",
    })
    .sort({ submittedAt: -1 })
    .lean();

  const results = attempts.map((attempt) => ({
    attemptId: attempt._id,
    examTitle: attempt.testSnapshot?.title || "Unknown Test",
    totalQuestions: attempt.totalQuestions,
    subject: attempt.testSnapshot?.subject || "Unknown Subject",
    obtainedMarks: attempt.obtainedMarks,
    totalMarks: attempt.totalMarks,
    percentage: attempt.percentage,
    status:
    attempt.percentage >= PASS_PERCENTAGE
    ? "Pass"
    : "Fail",
    submittedAt: attempt.submittedAt,
  }));

  return results;
};

// ======================================================
// GET REVIEW ANSWERS
// ======================================================

const getReviewAnswers = async (
  studentId,
  attemptId
) => {

  // ----------------------------------
  // Validate Attempt
  // ----------------------------------

  const attempt = await ExamAttempt.findById(
    attemptId
  ).lean();
  console.log("===== REVIEW =====");
  console.log("Attempt ID :", attempt?._id.toString());
  console.log("Status     :", attempt?.status);
  if (!attempt) {
    throw new ApiError(
      404,
      "Exam attempt not found."
    );
  }

  // ----------------------------------
  // Verify Student Ownership
  // ----------------------------------
    console.log("Attempt Student :", attempt.student.toString());
    console.log("Logged User     :", studentId.toString());
    console.log("Attempt ID      :", attemptId);
  if (
    attempt.student.toString() !==
    studentId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to access this review."
    );
  }

  // ----------------------------------
  // Review Available Only After Submission
  // ----------------------------------

  if (attempt.status !== "SUBMITTED") {
    throw new ApiError(
      400,
      "Please submit the exam first."
    );
  }

  // ----------------------------------
  // Load Snapshot
  // ----------------------------------

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

  // ----------------------------------
  // Load Student Answers
  // ----------------------------------

  const answers =
    await StudentAnswer.find({
      attempt: attemptId,
    }).lean();

  // ----------------------------------
  // Convert Answers Into Map
  // O(1) Lookup
  // ----------------------------------

  const answerMap = new Map();

  answers.forEach((answer) => {

    answerMap.set(
      answer.questionId.toString(),
      answer
    );

  });

  // ----------------------------------
  // Merge Snapshot + Student Answers
  // ----------------------------------

  const reviewQuestions =
    snapshot.questions.map(
      (question, index) => {

        const studentAnswer =
          answerMap.get(
            question.questionId.toString()
          );

        return {

          questionId:
            question.questionId,

          questionNumber:
            index + 1,

          subject:
            question.subject,

          chapter:
            question.chapter,

          difficulty:
            question.difficulty,

          question:
            question.question,

          marks:
            question.marks,

          options: [

            {
              value: "A",
              text: question.optionA,
            },

            {
              value: "B",
              text: question.optionB,
            },

            {
              value: "C",
              text: question.optionC,
            },

            {
              value: "D",
              text: question.optionD,
            },

          ],

          selectedAnswer:
            studentAnswer
              ?.selectedAnswer ?? null,

          correctAnswer:
            question.correctAnswer,

          isCorrect:
            studentAnswer
              ?.isCorrect ?? false,

          marksAwarded:
            studentAnswer
              ?.marksAwarded ?? 0,

          explanation:
            question.explanation || "",

        };

      }
    );

  // ----------------------------------
  // Final Response
  // ----------------------------------

  return {

    examTitle:
      snapshot.title,

    subject:
      snapshot.subject,

    obtainedMarks:
      attempt.obtainedMarks,

    totalMarks:
      attempt.totalMarks,

    percentage:
      attempt.percentage,

    totalQuestions:
      attempt.totalQuestions,

    submittedAt:
      attempt.submittedAt,

    questions:
      reviewQuestions,

  };

};
module.exports = {
  getDashboard,
  getAvailableExams,   // ← add
  startExam,
  getExamQuestions,
  saveAnswer,
  resumeExam,
  submitExam,
  getResult,
  getResultHistory,
  getReviewAnswers,
};