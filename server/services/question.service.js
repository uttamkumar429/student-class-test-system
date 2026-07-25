const Question = require("../models/Question");

// =====================================
// CREATE QUESTION
// =====================================
const createQuestion = async (questionData) => {
  return await Question.create(questionData);
};

// =====================================
// GET ALL QUESTIONS
// =====================================
const getAllQuestions = async (
  page = 1,
  limit = 10,
  search = "",
  subject = "",
  difficulty = "",
  sortBy = "createdAt",
  order = "desc"
) => {
  page = Math.max(1, Number(page));
  limit = Math.min(100, Math.max(1, Number(limit)));
  const skip = (page - 1) * limit;

  const filter = {};

  // Search
  if (search) {
    filter.$or = [
      {
        subject: {
          $regex: search,
          $options: "i",
        },
      },
      {
        chapter: {
          $regex: search,
          $options: "i",
        },
      },
      {
        question: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // Filters
  if (subject) {
    filter.subject = subject;
  }

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  // Sorting
  const allowedSortFields = [
    "createdAt",
    "subject",
    "difficulty",
    "marks",
  ];

  const sort = {};

  sort[
    allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt"
  ] = order === "asc" ? 1 : -1;

  // Execute in Parallel
  const [total, questions] = await Promise.all([
    Question.countDocuments(filter),

    Question.find(filter)
      .populate("createdBy", "fullName email")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    questions,
  };
};

// =====================================
// GET QUESTION BY ID
// =====================================
const getQuestionById = async (id) => {
  return await Question.findById(id)
    .populate("createdBy", "fullName email")
    .lean();
};

// =====================================
// UPDATE QUESTION
// =====================================
// const updateQuestion = async (id, data) => {
//   return await Question.findByIdAndUpdate(
//     id,
//     data,
//     {
//       new: true,
//       runValidators: true,
//     }
//   )
//     .populate("createdBy", "fullName email")
//     .lean();
// };
// =====================================
// UPDATE QUESTION
// =====================================
const updateQuestion = async (id, data) => {
  return await Question.findByIdAndUpdate(
    id,
    data,
    {
      returnDocument: "after",
      runValidators: true,
    }
  )
    .populate("createdBy", "fullName email")
    .lean();
};

// =====================================
// DELETE QUESTION
// =====================================
const deleteQuestion = async (id) => {
  return await Question.findByIdAndDelete(id).lean();
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};