const asyncHandler = require("../middleware/asyncHandler");

const {
  successResponse,
} = require("../utils/response");

const {
  getExamMonitoring: getExamMonitoringService,
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