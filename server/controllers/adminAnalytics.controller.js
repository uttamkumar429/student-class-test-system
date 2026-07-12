const asyncHandler = require("../middleware/asyncHandler");

const {
  successResponse,
} = require("../utils/response");

const {
  getExamStatistics: getExamStatisticsService,
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