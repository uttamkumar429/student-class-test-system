const asyncHandler = require("../middleware/asyncHandler");
const {
  getDashboardStats,
} = require("../services/dashboard.service");
const {
  successResponse,
} = require("../utils/response");
exports.getDashboardStats = asyncHandler(
  async (req, res) => {

    const stats = await getDashboardStats();

    return successResponse(
      res,
      200,
      "Dashboard statistics fetched successfully.",
      stats
    );
  }
);