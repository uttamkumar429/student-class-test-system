// const result = await getAllQuestionsService();
const asyncHandler = require("../middleware/asyncHandler");

const validateQuestion = require("../validators/question.validator");
const {
  successResponse,
  errorResponse,
} = require("../utils/response");


const {
  createQuestion: createQuestionService,
  getAllQuestions: getAllQuestionsService,
  getQuestionById: getQuestionByIdService,
  updateQuestion: updateQuestionService,
  deleteQuestion: deleteQuestionService,
} = require("../services/question.service");
// CREATE QUESTION

exports.createQuestion = asyncHandler(async (req, res) => {

  const errors = validateQuestion(req.body);

  if (errors.length) {
    return errorResponse(res, 400, errors);
  }

  const question = await createQuestionService({
    ...req.body,
    createdBy: req.user._id,
  });

  return successResponse(
    res,
    201,
    "Question created successfully.",
    question
  );
});


// GET ALL QUESTIONS

exports.getAllQuestions = asyncHandler(async (req, res) => {

const result = await getAllQuestionsService();

  return successResponse(
    res,
    200,
    "Questions fetched successfully.",
    result
  );

});
// ===============================
// GET QUESTION BY ID
// ===============================
exports.getQuestionById = asyncHandler(async (req, res) => {

  const question = await getQuestionById(req.params.id);

  if (!question) {
    throw new Error("Question not found.");
  }

  return successResponse(
    res,
    200,
    "Question fetched successfully.",
    question
  );

});

// UPDATE QUESTION

exports.updateQuestion = asyncHandler(async (req, res) => {

  const question = await updateQuestion(
    req.params.id,
    req.body
  );

  if (!question) {
    throw new Error("Question not found.");
  }

  return successResponse(
    res,
    200,
    "Question updated successfully.",
    question
  );

});
// DELETE QUESTION
exports.deleteQuestion = asyncHandler(async (req, res) => {

  const question = await deleteQuestion(req.params.id);

  if (!question) {
    throw new Error("Question not found.");
  }

  return successResponse(
    res,
    200,
    "Question deleted successfully."
  );

});