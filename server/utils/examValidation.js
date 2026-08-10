const ApiError = require("./ApiError");

// ==========================================
// GET CURRENT TIME
// ==========================================

const getCurrentTime = () => new Date();

// ==========================================
// VALIDATE SNAPSHOT
// ==========================================

const validateSnapshot = (snapshot) => {

  if (!snapshot) {
    throw new ApiError(
      404,
      "Exam not found."
    );
  }

};

// ==========================================
// VALIDATE EXAM WINDOW
// ==========================================

const validateExamWindow = (snapshot) => {

  const now = getCurrentTime();

  if (now < snapshot.startTime) {

    throw new ApiError(
      400,
      "Exam has not started yet."
    );

  }

  if (now > snapshot.endTime) {

    throw new ApiError(
      400,
      "Exam has already ended."
    );

  }

};

// ==========================================
// VALIDATE STUDENT
// ==========================================

const validateStudent = (student) => {

  if (!student) {

    throw new ApiError(
      404,
      "Student not found."
    );

  }

  if (student.isBlocked) {

    throw new ApiError(
      403,
      "Your account has been blocked."
    );

  }

};

// ==========================================
// VALIDATE ATTEMPT
// ==========================================

const validateAttempt = (attempt) => {

  if (
    attempt &&
    attempt.status === "SUBMITTED"
  ) {

    throw new ApiError(
      409,
      "You have already submitted this exam."
    );

  }

};

// ==========================================
// CAN RESUME
// ==========================================

const canResumeAttempt = (
  snapshot,
  attempt
) => {

  if (!attempt) {

    return false;

  }

  if (
    attempt.status !== "IN-PROGRESS"
  ) {

    return false;

  }

  return (
    getCurrentTime() <= snapshot.endTime
  );

};

// ==========================================
// INITIALIZE ANSWERS
// ==========================================

const initializeAnswers = (
  questions = []
) => {

  return questions.map(
    (question) => ({

      questionId:
        question.questionId,

      selectedAnswer: null,

      isCorrect: false,

      marksAwarded: 0,

      answeredAt: null,

    })
  );

};

module.exports = {

  validateSnapshot,

  validateExamWindow,

  validateStudent,

  validateAttempt,

  canResumeAttempt,

  initializeAnswers,

};