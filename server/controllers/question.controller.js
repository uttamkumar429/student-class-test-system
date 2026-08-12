const mongoose = require("mongoose");

const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");

const {
  successResponse,
} = require("../utils/response");

const {
  createQuestion: createQuestionService,
  getAllQuestions: getAllQuestionsService,
  getQuestionMetadata: getQuestionMetadataService,
  getQuestionById: getQuestionByIdService,
  updateQuestion: updateQuestionService,
  deleteQuestion: deleteQuestionService,
} = require("../services/question.service");

// ======================================
// VALIDATE MONGODB OBJECT ID
// ======================================

const validateQuestionId = (id) => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    throw new ApiError(
      400,
      "Invalid question ID."
    );
  }

  return id;
};

// ======================================
// CREATE QUESTION
// ======================================

exports.createQuestion = asyncHandler(
  async (req, res) => {
    const question =
      await createQuestionService({
        ...req.body,
        createdBy: req.user._id,
      });

    return successResponse(
      res,
      201,
      "Question created successfully.",
      question
    );
  }
);

// ======================================
// GET ALL QUESTIONS
// ======================================

exports.getAllQuestions = asyncHandler(
  async (req, res) => {
    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : "";

    const subject =
      typeof req.query.subject === "string"
        ? req.query.subject
        : "";

    const chapter =
      typeof req.query.chapter === "string"
        ? req.query.chapter
        : "";

    const difficulty =
      typeof req.query.difficulty === "string"
        ? req.query.difficulty
        : "";

    const sortBy =
      typeof req.query.sortBy === "string"
        ? req.query.sortBy
        : "createdAt";

    const order =
      req.query.order === "asc"
        ? "asc"
        : "desc";

    const result =
      await getAllQuestionsService(
        page,
        limit,
        search,
        subject,
        chapter,
        difficulty,
        sortBy,
        order
      );

    return successResponse(
      res,
      200,
      "Questions fetched successfully.",
      result
    );
  }
);
// ======================================
// GET QUESTION FILTER METADATA
// ======================================

exports.getQuestionMetadata = asyncHandler(
  async (req, res) => {
    const metadata =
      await getQuestionMetadataService();

    return successResponse(
      res,
      200,
      "Question metadata fetched successfully.",
      metadata
    );
  }
);

// ======================================
// GET QUESTION BY ID
// ======================================

exports.getQuestionById = asyncHandler(
  async (req, res) => {
    const questionId =
      validateQuestionId(
        req.params.id
      );

    const question =
      await getQuestionByIdService(
        questionId
      );

    if (!question) {
      throw new ApiError(
        404,
        "Question not found."
      );
    }

    return successResponse(
      res,
      200,
      "Question fetched successfully.",
      question
    );
  }
);

// ======================================
// UPDATE QUESTION
// ======================================

exports.updateQuestion = asyncHandler(
  async (req, res) => {
    const questionId =
      validateQuestionId(
        req.params.id
      );

    const question =
      await updateQuestionService(
        questionId,
        req.body
      );

    if (!question) {
      throw new ApiError(
        404,
        "Question not found."
      );
    }

    return successResponse(
      res,
      200,
      "Question updated successfully.",
      question
    );
  }
);

// ======================================
// DELETE QUESTION
// ======================================

exports.deleteQuestion = asyncHandler(
  async (req, res) => {
    const questionId =
      validateQuestionId(
        req.params.id
      );

    const question =
      await deleteQuestionService(
        questionId
      );

    if (!question) {
      throw new ApiError(
        404,
        "Question not found."
      );
    }

    return successResponse(
      res,
      200,
      "Question deleted successfully."
    );
  }
);