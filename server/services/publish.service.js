const Test = require("../models/Test");
const TestSnapshot = require("../models/TestSnapshot");

// =====================================
// PUBLISH TEST
// =====================================
const publishTest = async (testId) => {

  // Find Test
  const test = await Test.findById(testId)

    .populate("questions");
    // Already Published Validation
  if (test.status === "published") {
    throw new Error("Test is already published.");
  }
  // Question Validation
  if (!test.questions || test.questions.length === 0) {
    throw new Error("Cannot publish a test without questions.");
  } 

  if (!test) {
    throw new Error("Test not found.");
  }

  // Only Draft can be published
  if (test.status !== "draft") {
    throw new Error("Only draft tests can be published.");
  }

  // Check Snapshot Already Exists
  const existingSnapshot = await TestSnapshot.findOne({
    testId,
  });

  if (existingSnapshot) {
    throw new Error("Snapshot already exists.");
  }

  // Create Snapshot
  await TestSnapshot.create({

    testId: test._id,

    title: test.title,

    subject: test.subject,

    duration: test.duration,

    totalMarks: test.totalMarks,

    totalQuestions: test.totalQuestions,

    startTime: test.startTime,

    endTime: test.endTime,

    questions: test.questions.map((q) => ({

      questionId: q._id,

      subject: q.subject,

      chapter: q.chapter,

      difficulty: q.difficulty,

      question: q.question,

      optionA: q.optionA,

      optionB: q.optionB,

      optionC: q.optionC,

      optionD: q.optionD,

      correctAnswer: q.correctAnswer,

      explanation: q.explanation,

      marks: q.marks,

    })),
  });

  // Update Status
  test.status = "published";

  await test.save();

  return test;
};

module.exports = {
  publishTest,
};