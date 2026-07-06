const Test = require("../models/Test");
const Question = require("../models/Question");

// =====================================
// COMMON BUSINESS LOGIC
// =====================================
const processQuestions = async (questionIds) => {

  // Duplicate Check
  const uniqueIds = [...new Set(questionIds)];

  if (uniqueIds.length !== questionIds.length) {
    throw new Error("Duplicate questions are not allowed.");
  }

  // Fetch Questions
  const questions = await Question.find({
    _id: { $in: questionIds },
  });

  // Invalid IDs
  if (questions.length !== questionIds.length) {
    throw new Error("One or more Question IDs are invalid.");
  }

  // Same Subject Check
  const subject = questions[0].subject;

  const differentSubject = questions.find(
    (q) => q.subject !== subject
  );

  if (differentSubject) {
    throw new Error(
      "All selected questions must belong to the same subject."
    );
  }

  // Calculate Marks
  const totalMarks = questions.reduce(
    (sum, question) => sum + question.marks,
    0
  );

  return {
    questions,
    totalMarks,
    totalQuestions: questions.length,
  };
};

// =====================================
// CREATE TEST
// =====================================
const createTest = async (testData) => {

  const result = await processQuestions(
    testData.questions
  );

  const test = await Test.create({
    ...testData,
    totalMarks: result.totalMarks,
    totalQuestions: result.totalQuestions,
  });

  return test;
};

// =====================================
// GET ALL TESTS
// =====================================
const getAllTests = async () => {

  return await Test.find()
    .populate("createdBy", "fullName email")
    .populate("questions")
    .sort({
      createdAt: -1,
    });

};

// =====================================
// GET TEST BY ID
// =====================================
const getTestById = async (id) => {

  return await Test.findById(id)
    .populate("createdBy", "fullName email")
    .populate("questions");

};
// =====================================
// UPDATE TEST
// =====================================
const updateTest = async (id, testData) => {

  const result = await processQuestions(
    testData.questions
  );

  const test = await Test.findByIdAndUpdate(
    id,
    {
      ...testData,
      totalMarks: result.totalMarks,
      totalQuestions: result.totalQuestions,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("createdBy", "fullName email")
    .populate("questions");

  return test;
};

module.exports = {
  createTest,
  getAllTests,
  getTestById,
  updateTest,
  processQuestions,
};