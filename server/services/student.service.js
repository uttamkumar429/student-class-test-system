const ExamAttempt = require("../models/ExamAttempt");
const TestSnapshot = require("../models/TestSnapshot");
const StudentAnswer = require("../models/StudentAnswer");

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
    throw new Error("Exam has not started yet.");
  }

  if (now > snapshot.endTime) {
    throw new Error("Exam has already ended.");
  }

  // Check Existing Attempt
  const existingAttempt = await ExamAttempt.findOne({
    student: studentId,
    testSnapshot: snapshotId,
  });

  if (existingAttempt) {
    throw new Error("You have already started this exam.");
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

    throw new Error(
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
    throw new Error("Exam attempt not found.");
  }

  // Security Check
  if (attempt.student.toString() !== studentId.toString()) {
    throw new Error("Unauthorized access.");
  }

  // Already Submitted?
  if (attempt.status === "submitted") {
    throw new Error("Exam already submitted.");
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
    throw new Error("Test snapshot not found.");
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

  selectedAnswer

) => {

  // Check Attempt

  const attempt = await ExamAttempt.findById(attemptId);

  if (!attempt) {

    throw new Error("Exam attempt not found.");

  }

  // Ownership Check

  if (attempt.student.toString() !== studentId.toString()) {

    throw new Error("Unauthorized access.");

  }

  // Already Submitted?

  if (attempt.status === "submitted") {

    throw new Error("Exam already submitted.");

  }

  // Load Snapshot

  const snapshot = await TestSnapshot.findById(
    attempt.testSnapshot
  );

  if (!snapshot) {

    throw new Error("Snapshot not found.");

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

    throw new Error("Question not found.");

  }

  // Correct?

  const isCorrect =
    question.correctAnswer === selectedAnswer;

  // Already Saved?

  const existingAnswer = await StudentAnswer.findOne({

    attempt: attemptId,

    questionId,

  });


  if (existingAnswer) {

    existingAnswer.selectedAnswer = selectedAnswer;

    existingAnswer.correctAnswer =
      question.correctAnswer;

    existingAnswer.isCorrect = isCorrect;

    existingAnswer.marksAwarded = isCorrect
      ? question.marks
      : 0;

      await existingAnswer.save();

    
 
       return existingAnswer;
    }

  // Create New Answer

  const answer = await StudentAnswer.create({

    attempt: attemptId,

    questionId,

    selectedAnswer,

    correctAnswer: question.correctAnswer,

    isCorrect,

    marksAwarded: isCorrect
      ? question.marks
      : 0,

  });

  return answer;

};
// ======================================
// RESUME EXAM
// ======================================

const resumeExam = async (studentId) => {

  // Find Running Attempt
  const attempt = await ExamAttempt.findOne({
  student: studentId,
  status:"in-progress"
  })
  .select(
  "_id totalQuestions status testSnapshot"
  );
  if (!attempt) {
    throw new Error("No running exam found.");
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
    throw new Error("Test snapshot not found.");
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

    answeredQuestions,

    remainingTime,

    status: attempt.status,

  };

};

// SUBMIT EXAM
// ======================================
const submitExam = async (studentId, attemptId) => {

  // Find Attempt
  const attempt = await ExamAttempt.findById(attemptId);

  if (!attempt) {
    throw new Error("Exam attempt not found.");
  }

  // Security Check
  if (attempt.student.toString() !== studentId.toString()) {
    throw new Error("Unauthorized access.");
  }

  // Already Submitted?
  if (attempt.status === "submitted") {
    throw new Error("Exam already submitted.");
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

  const timeTaken = Math.ceil(
    (submittedAt - attempt.startedAt) / (1000 * 60)
  );

  // Update Attempt
  attempt.obtainedMarks = obtainedMarks;
  attempt.percentage = percentage;
  attempt.timeTaken = timeTaken;
  attempt.submittedAt = submittedAt;
  attempt.status = "submitted";

  await attempt.save();

  return {
    obtainedMarks,
    totalMarks: attempt.totalMarks,
    percentage,
    timeTaken,
  };

};
// ======================================
// GET RESULT
// ======================================
const getResult = async (studentId, attemptId) => {

  // Find Attempt
  const attempt = await ExamAttempt.findById(attemptId);

  if (!attempt) {
    throw new Error("Exam attempt not found.");
  }

  // Security Check
  if (attempt.student.toString() !== studentId.toString()) {
    throw new Error("Unauthorized access.");
  }

  // Result only after submission
  if (attempt.status !== "submitted") {
    throw new Error("Exam is not submitted yet.");
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
    throw new Error("Test snapshot not found.");
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
    (answer) => !answer.isCorrect
  ).length;

  const skippedAnswers =
    attempt.totalQuestions - answers.length;

  return {
    examTitle: snapshot.title,
    subject: snapshot.subject,
    obtainedMarks: attempt.obtainedMarks,
    totalMarks: attempt.totalMarks,
    percentage: attempt.percentage,
    correctAnswers,
    wrongAnswers,
    skippedAnswers,
    timeTaken: attempt.timeTaken,
    submittedAt: attempt.submittedAt,
    status:
      attempt.percentage >= 33
        ? "Pass"
        : "Fail",
  };

};
// ======================================
// GET RESULT HISTORY
// ======================================
const getResultHistory = async (studentId) => {

  // Load Submitted Attempts
  const attempts = await ExamAttempt.find({
    student: studentId,
    status: "submitted",
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
    subject: attempt.testSnapshot?.subject || "Unknown Subject",
    obtainedMarks: attempt.obtainedMarks,
    totalMarks: attempt.totalMarks,
    percentage: attempt.percentage,
    status: attempt.percentage >= 33 ? "Pass" : "Fail",
    submittedAt: attempt.submittedAt,
  }));

  return results;
};
module.exports = {
  getDashboard,
  startExam,
  getExamQuestions,
  saveAnswer,
  resumeExam,
  submitExam,
  getResult,
  getResultHistory,
};