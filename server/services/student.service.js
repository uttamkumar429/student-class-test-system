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
    .sort({ startTime: 1 });

  const active = await TestSnapshot.find({
    startTime: { $lte: now },
    endTime: { $gte: now }
  })
    .select(
      "title subject duration totalMarks totalQuestions startTime endTime"
    )
    .sort({ startTime: 1 });

  const completed = await TestSnapshot.find({
    endTime: { $lt: now }
  })
    .select(
      "title subject duration totalMarks totalQuestions startTime endTime"
    )
    .sort({ endTime: -1 });

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
  const snapshot = await TestSnapshot.findById(snapshotId);

  if (!snapshot) {
    throw new Error("Test not found.");
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
// =====================================
// GET EXAM QUESTIONS
// =====================================
const getExamQuestions = async (studentId, attemptId) => {

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

  // Load Snapshot
  const snapshot = await TestSnapshot.findById(
    attempt.testSnapshot
  );

  if (!snapshot) {
    throw new Error("Test snapshot not found.");
  }

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

module.exports = {
  getDashboard,
  startExam,
  getExamQuestions,
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
  console.log("1. Attempt Found:", attempt);
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

  // Find Question

 const question = snapshot.questions.find(

    (q) => q.questionId.toString() === questionId

);
console.log("2. Question Found:", question);

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
  console.log("3. Existing Answer:", existingAnswer);

  if (existingAnswer) {

    existingAnswer.selectedAnswer = selectedAnswer;

    existingAnswer.correctAnswer =
      question.correctAnswer;

    existingAnswer.isCorrect = isCorrect;

    existingAnswer.marksAwarded = isCorrect
      ? question.marks
      : 0;

      await existingAnswer.save();

      console.log("4. Updated Answer:", existingAnswer);
 
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
  console.log("5. Created Answer:", answer);
  return answer;

};


module.exports = {

  getDashboard,

  startExam,

  getExamQuestions,

  saveAnswer,

};
// ======================================
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
    attempt: attemptId,
  });

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
module.exports = {
  getDashboard,
  startExam,
  getExamQuestions,
  saveAnswer,
  submitExam,
};