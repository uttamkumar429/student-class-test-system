const asyncHandler = require("../utils/asyncHandler");

const {
  getDashboardStats,
} = require("../services/dashboard.service");

exports.getDashboardStats = asyncHandler(
  async (req, res) => {

    const stats = await getDashboardStats();

    res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully.",
      data: stats,
    });

  }
);