const asyncHandler = require("../middleware/asyncHandler");
const {
  successResponse,
  
} = require("../utils/response");


const {
  getDashboard: getDashboardService,
  getAvailableExams: getAvailableExamsService,
  startExam: startExamService,
  getExamQuestions: getExamQuestionsService,
  saveAnswer: saveAnswerService,
  submitExam: submitExamService,
  resumeExam: resumeExamService,
  getResult: getResultService,
  getResultHistory: getResultHistoryService,
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

exports.getAvailableExams = asyncHandler(async (req, res) => {

  const exams = await getAvailableExamsService();
  return successResponse(
    res,
    200,
    "Available exams fetched successfully.",
    {
      exams,
    }
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
    req.body.selectedAnswer,
    req.body.currentQuestionIndex
  );

  return successResponse(
    res,
    200,
    "Answer saved successfully."
  );

});
// =====================================
// RESUME EXAM
// =====================================

exports.resumeExam = asyncHandler(async (req, res) => {

  const result = await resumeExamService(req.user._id);

  return successResponse(
    res,
    200,
    "Exam resumed successfully.",
    result
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
// =====================================
// RESULT DETAILS
// =====================================

exports.getResult = asyncHandler(async (req, res) => {

  const result = await getResultService(
    req.user._id,
    req.params.attemptId
  );

  return successResponse(
    res,
    200,
    "Result fetched successfully.",
    result
  );

});
// =====================================
// RESULT HISTORY
// =====================================

exports.getResultHistory = asyncHandler(async (req, res) => {

  const results = await getResultHistoryService(
    req.user._id
  );

  return successResponse(
    res,
    200,
    "Result history fetched successfully.",
    results
  );

});


