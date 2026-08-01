const studentDashboardService = require("../services/studentDashboard.service");

// ===================================================
// Get Student Dashboard
// ===================================================
const getDashboard = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const dashboard =
      await studentDashboardService.getDashboard(
        studentId
      );

    return res.status(200).json({
      success: true,
      message: "Student dashboard fetched successfully.",
      data: dashboard,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
};