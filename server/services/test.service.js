const Test = require("../models/Test");
const Question = require("../models/Question");
const ApiError = require("../utils/ApiError");
const TestSnapshot = require("../models/TestSnapshot");
// =====================================
// COMMON BUSINESS LOGIC
// =====================================
const processQuestions = async (questionIds) => {

  // Duplicate Check
  const uniqueIds = [...new Set(questionIds)];

  if (uniqueIds.length !== questionIds.length) {
    throw new ApiError(
      400,
      "Duplicate questions are not allowed."
    );
  }

  // Fetch Questions
  const questions = await Question.find({
    _id: { $in: questionIds },
  });

  // Invalid IDs
  if (questions.length !== questionIds.length) {
    throw new ApiError(
      400,
      "One or more Question IDs are invalid."
    );
  }

  // Same Subject Check
  const subject = questions[0].subject;

  const differentSubject = questions.find(
    (q) => q.subject !== subject
  );

  if (differentSubject) {
    throw new ApiError(
        400,
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
const title = testData.title.trim();

  const existingTest = await Test.findOne({
    title: {
      $regex: `^${title}$`,
      $options: "i",
    },
  });

  if (existingTest) {
    throw new ApiError(
        409,
        "Test with this title already exists."
    );
  }
  // Validate Start Time
const now = new Date();

if (new Date(testData.startTime) < now) {
  throw new ApiError(
      400,
      "Start time cannot be in the past."
  );
}
// Validate End Time
if (new Date(testData.endTime) <= new Date(testData.startTime)) {
  throw new ApiError(
    400,
    "End time must be greater than start time."
  );
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

  page = Math.max(1, Number(page));
  limit = Math.min(100, Math.max(1, Number(limit)));

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

  const [total, tests] = await Promise.all([
    Test.countDocuments(filter),

    Test.find(filter)
      .populate("createdBy", "fullName email")
      .populate("questions")
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

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
    .populate("questions")
    .lean();

};
// =====================================
// UPDATE TEST
// =====================================
const updateTest = async (id, data) => {

  const test = await Test.findById(id);

  if (!test) {
    throw new ApiError(
      404,
      "Test not found."
    );
  }

  // Prevent editing published test
  if (test.status === "published") {
    throw new ApiError(
        409,
        "Published test cannot be updated."
    );
  }

  const questionIds = data.questions || test.questions;

  const result = await processQuestions(questionIds);

  const updateData = {
    title: data.title ?? test.title,
    subject: data.subject ?? test.subject,
    description: data.description ?? test.description,
    duration: data.duration ?? test.duration,
    questions: questionIds,
    startTime: data.startTime ?? test.startTime,
    endTime: data.endTime ?? test.endTime,
    totalMarks: result.totalMarks,
    totalQuestions: result.totalQuestions,
  };
  if (data.title) {
    const duplicate = await Test.findOne({
      title: {
        $regex: `^${data.title}$`,
        $options: "i",
      },
      _id: { $ne: id },
    });

  if (duplicate) {
    throw new ApiError(
        409,
        "Test with this title already exists."
    );
  }
}
  const startTime = data.startTime ?? test.startTime;
  const endTime = data.endTime ?? test.endTime;

  if (new Date(startTime) < new Date()) {
    throw new ApiError(
        400,
        "Start time cannot be in the past."
    );
  }

  if (new Date(endTime) <= new Date(startTime)) {
    throw new ApiError(
        400,
        "End time must be greater than start time."
    );
  }
  return await Test.findByIdAndUpdate(
    id,
    updateData,
    {
      returnDocument: "after",
      runValidators: true,
    }
  )
  .populate("questions")
  .populate("createdBy", "fullName email")
  .lean();
    

};
// =====================================
// DELETE TEST
// =====================================
const deleteTest = async (id) => {

  const test = await Test.findById(id);

  if (!test) {
    throw new ApiError(
        404,
        "Test not found."
    );
  }

  // Prevent deleting published test
  if (test.status === "published") {
    throw new ApiError(
        409,
        "Published test cannot be deleted."
    );
  }

  return await Test.findByIdAndDelete(id);

};
// =====================================
// PUBLISH TEST
// =====================================

const publishTest = async (id) => {

  const test = await Test.findById(id)
    .populate("questions");

  if (!test) {
    throw new ApiError(
      404,
      "Test not found."
    );
  }

  if (test.status === "published") {
    throw new ApiError(
      409,
      "Test is already published."
    );
  }

  // Create Snapshot

  const snapshot = await TestSnapshot.create({

    testId: test._id,

    title: test.title,

    subject: test.subject,

    duration: test.duration,

    totalMarks: test.totalMarks,

    totalQuestions: test.totalQuestions,

    startTime: test.startTime,

    endTime: test.endTime,

    questions: test.questions.map((question) => ({
      questionId: question._id,

      subject: question.subject,

      chapter: question.chapter,

      difficulty: question.difficulty,

      question: question.question,

      optionA: question.optionA,

      optionB: question.optionB,

      optionC: question.optionC,

      optionD: question.optionD,

      correctAnswer: question.correctAnswer,

      explanation: question.explanation,

      marks: question.marks,
    })),
  });

  test.status = "published";

  await test.save();

  return snapshot;
};

module.exports = {
  createTest,
  getAllTests,
  getTestById,
  updateTest,
  deleteTest,
  processQuestions,
  publishTest,
};