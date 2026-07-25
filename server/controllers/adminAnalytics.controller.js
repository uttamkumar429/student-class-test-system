const asyncHandler = require("../middleware/asyncHandler");

const {
  successResponse,
} = require("../utils/response");

const {
  getExamStatistics: getExamStatisticsService,
  getTopPerformers: getTopPerformersService,
  getWeakStudents: getWeakStudentsService,
} = require("../services/adminAnalytics.service");

// =====================================
// EXAM STATISTICS
// =====================================

exports.getExamStatistics = asyncHandler(async (req, res) => {

  const result = await getExamStatisticsService(
    req.params.snapshotId
  );

  return successResponse(
    res,
    200,
    "Statistics fetched successfully.",
    result
  );

});
// =====================================
// TOP PERFORMERS
// =====================================

exports.getTopPerformers = asyncHandler(async (req, res) => {

  const limit = Math.min(
    100,
    Math.max(1, Number(req.query.limit) || 10)
  );

  const result = await getTopPerformersService(
    req.params.snapshotId,
    limit
  );

  return successResponse(
    res,
    200,
    "Top performers fetched successfully.",
    result
  );

});
// =====================================
// WEAK STUDENTS
// =====================================

exports.getWeakStudents = asyncHandler(async (req, res) => {

  const limit = Math.min(
    100,
    Math.max(1, Number(req.query.limit) || 20)
  );

  const result = await getWeakStudentsService(
    req.params.snapshotId,
    limit
  );

  return successResponse(
    res,
    200,
    "Weak students fetched successfully.",
    result
  );

});