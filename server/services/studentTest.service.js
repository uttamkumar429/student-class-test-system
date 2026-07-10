const Test = require("../models/Test");
const TestAttempt = require("../models/TestAttempt");

const startTest = async (studentId, testId) => {

  // Find Test
  const test = await Test.findById(testId).populate("questions");

  if (!test) {
    throw new Error("Test not found.");
  }

  // Check Published
  if (test.status !== "published") {
    throw new Error("Test is not available.");
  }

  // Time Validation

  const now = new Date();

  if (now < test.startTime || now > test.endTime) {
    throw new Error("Test is not active.");
  }

  // Duplicate Attempt

  const alreadyAttempted = await TestAttempt.findOne({

    student: studentId,

    test: testId,

  });

  if (alreadyAttempted) {
    throw new Error("You have already attempted this test.");
  }

  // Total Marks

  const totalMarks = test.questions.reduce((sum, question) => {

    return sum + question.marks;

  }, 0);

  // Create Attempt

  const attempt = await TestAttempt.create({

    student: studentId,

    test: testId,

    totalQuestions: test.questions.length,

    totalMarks,

    status: "started",

  });

  return {

    attemptId: attempt._id,

    testId: test._id,

    startedAt: attempt.startedAt,

    status: attempt.status,

  };

};

module.exports = {

  startTest,

};