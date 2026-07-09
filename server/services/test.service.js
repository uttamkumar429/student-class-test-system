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

  // Check Duplicate Title
  const existingTest = await Test.findOne({
    title: testData.title,
  });

  if (existingTest) {
    throw new Error("Test with this title already exists.");
  }
  // Validate Start Time
const now = new Date();

if (new Date(testData.startTime) < now) {
  throw new Error("Start time cannot be in the past.");
}
// Validate End Time
if (new Date(testData.endTime) <= new Date(testData.startTime)) {
  throw new Error("End time must be greater than start time.");
}

  // Process Questions
  const result = await processQuestions(
    testData.questions
  );

  // Create Test
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
const getAllTests = async (
  page = 1,
  limit = 10,
  sort = "newest",
  status = "",
  subject = "",
  search = "",
  startDate = "",
  endDate = "",
  duration=""
) => {

  const skip = (page - 1) * limit;

  let sortOption = {};

  switch (sort) {

    case "oldest":
      sortOption = { createdAt: 1 };
      break;

    case "title":
      sortOption = { title: 1 };
      break;

    case "subject":
      sortOption = { subject: 1 };
      break;

    default:
      sortOption = { createdAt: -1 };

  }

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (subject) {
    filter.subject = subject;
  }
  if (duration) {
    filter.duration = Number(duration);
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

  // Date Range Filter
  if (startDate || endDate) {

    filter.createdAt = {};

    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }

    if (endDate) {
      filter.createdAt.$lte = new Date(endDate);
    }

  }

  const total = await Test.countDocuments(filter);

  const tests = await Test.find(filter)
    .populate("createdBy", "fullName email")
    .populate("questions")
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    tests,
  };

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
const updateTest = async (id, data) => {

  const test = await Test.findById(id);

  if (!test) {
    throw new Error("Test not found.");
  }

  // Prevent editing published test
  if (test.status === "published") {
    throw new Error("Published test cannot be updated.");
  }

  const result = await processQuestions(
    data.questions
  );

  return await Test.findByIdAndUpdate(
    id,
    {
      ...data,
      totalMarks: result.totalMarks,
      totalQuestions: result.totalQuestions,
    },
    {
      new: true,
      runValidators: true,
    }
  )
  .populate("questions")
  .populate("createdBy", "fullName email");

};
// =====================================
// DELETE TEST
// =====================================
const deleteTest = async (id) => {

  const test = await Test.findById(id);

  if (!test) {
    throw new Error("Test not found.");
  }

  // Prevent deleting published test
  if (test.status === "published") {
    throw new Error("Published test cannot be deleted.");
  }

  return await Test.findByIdAndDelete(id);

};

module.exports = {
  createTest,
  getAllTests,
  getTestById,
  updateTest,
  deleteTest,
  processQuestions,
};