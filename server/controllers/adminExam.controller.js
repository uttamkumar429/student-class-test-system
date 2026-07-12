const asyncHandler = require("../middleware/asyncHandler");

const {
  successResponse,
} = require("../utils/response");

const {
  getExamMonitoring: getExamMonitoringService,
  getStudentAttempts: getStudentAttemptsService,
  getAttemptDetails: getAttemptDetailsService,
} = require("../services/adminExam.service");

// =====================================
// EXAM MONITORING
// =====================================
exports.getExamMonitoring = asyncHandler(async (req, res) => {

  const result = await getExamMonitoringService(
    req.params.snapshotId
  );

  return successResponse(
    res,
    200,
    "Exam monitoring fetched successfully.",
    result
  );

});
// =====================================
// STUDENT ATTEMPT LIST
// =====================================

exports.getStudentAttempts = asyncHandler(async (req, res) => {

  const result = await getStudentAttemptsService(
    req.params.snapshotId
  );

  return successResponse(
    res,
    200,
    "Student attempts fetched successfully.",
    result
  );

});
// =====================================
// ATTEMPT DETAILS
// =====================================

exports.getAttemptDetails = asyncHandler(async (req, res) => {

  const result = await getAttemptDetailsService(
    req.params.snapshotId,
    req.params.attemptId
  );

  return successResponse(
    res,
    200,
    "Attempt details fetched successfully.",
    result
  );

});