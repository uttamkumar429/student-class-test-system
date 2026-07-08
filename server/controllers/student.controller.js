const asyncHandler = require("../middleware/asyncHandler");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");


const {
  getDashboard: getDashboardService,
  startExam: startExamService,
  getExamQuestions: getExamQuestionsService,
  saveAnswer: saveAnswerService,
  submitExam: submitExamService,
} = require("../services/student.service");

// STUDENT DASHBOARD

exports.getDashboard = asyncHandler(async (req, res) => {

  const dashboard = await getDashboardService();

  return successResponse(
    res,
    200,
    "Dashboard fetched successfully.",
    dashboard
  );

});
// =====================================
// START EXAM
// =====================================
exports.startExam = asyncHandler(async (req, res) => {

  const attempt = await startExamService(
    req.user._id,
    req.params.snapshotId
  );

  return successResponse(
    res,
    201,
    "Exam started successfully.",
    attempt
  );

});
// =====================================
// GET EXAM QUESTIONS
// =====================================
exports.getExamQuestions = asyncHandler(async (req, res) => {

  const result = await getExamQuestionsService(
    req.user._id,
    req.params.attemptId
  );

  return successResponse(
    res,
    200,
    "Questions fetched successfully.",
    result
  );

});

// SAVE ANSWER
exports.saveAnswer = asyncHandler(async (req, res) => {

  await saveAnswerService(
    req.user._id,
    req.params.attemptId,
    req.body.questionId,
    req.body.selectedAnswer
  );

  return successResponse(
    res,
    200,
    "Answer saved successfully."
  );

});

// SUBMIT EXAM

exports.submitExam = asyncHandler(async (req, res) => {

  const result = await submitExamService(
    req.user._id,
    req.params.attemptId
  );

  return successResponse(
    res,
    200,
    "Exam submitted successfully.",
    result
  );

});