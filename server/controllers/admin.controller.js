const asyncHandler = require("../middleware/asyncHandler");

const {
  successResponse,
} = require("../utils/response");

const {
  getDashboard: getDashboardService,
} = require("../services/admin.service");

// =========================================
// ADMIN DASHBOARD
// =========================================

exports.getDashboard = asyncHandler(async (req, res) => {

  const dashboard = await getDashboardService();

  return successResponse(
    res,
    200,
    "Dashboard data fetched successfully.",
    dashboard
  );

});