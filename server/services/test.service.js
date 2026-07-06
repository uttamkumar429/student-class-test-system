const Test = require("../models/Test");
const Question = require("../models/Question");

// ===============================
// CREATE TEST
// ===============================
const createTest = async (testData) => {
  const questions = await Question.find({
    _id: { $in: testData.questions },
  });

  // Check all questions exist
  if (questions.length !== testData.questions.length) {
    throw new Error("One or more Question IDs are invalid.");
  }

  // Calculate Total Marks
  const totalMarks = questions.reduce(
    (sum, question) => sum + question.marks,
    0
  );

  // Calculate Total Questions
  const totalQuestions = questions.length;

  const test = await Test.create({
    ...testData,
    totalMarks,
    totalQuestions,
  });

  return test;
};

module.exports = {
  createTest,
};