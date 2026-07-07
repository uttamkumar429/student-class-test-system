const {
  getDashboard,
  startExam: startExamService,
} = require("../services/student.service");

// ==========================================
// STUDENT DASHBOARD
// ==========================================
exports.getDashboard = async (req, res) => {

  try {

    const dashboard = await getDashboard();

    return res.status(200).json({
      success: true,
      dashboard,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};
// =====================================
// START EXAM
// =====================================
exports.startExam = async (req, res) => {

  try {

    const attempt = await startExamService(

      req.user._id,

      req.params.snapshotId

    );

    return res.status(201).json({
      success: true,
      message: "Exam started successfully.",
      attempt,
    });

  } catch (error) {

    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};