const Test = require("../models/Test");
const TestSnapshot = require("../models/TestSnapshot");

// =====================================
// PUBLISH TEST
// =====================================
const publishTest = async (testId) => {

  // Find Test
  const test = await Test.findById(testId)
    .populate("questions");

  if (!test) {
    throw new ApiError(404, "Test not found.");
  }

  if (test.status === "published") {
    throw new ApiError(409, "Test is already published.");
  }

  if (!test) {
    throw new ApiError(
      404,
      "Test not found."
    );
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
    throw new ApiError(
      409,
      "Snapshot already exists."
    );
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
  await Test.findByIdAndUpdate(
    test._id,
    {
      status: "published",
    },
    {
      runValidators: true,
    }
  );

  return test;
};

module.exports = {
  publishTest,
};