const asyncHandler = require("../middleware/asyncHandler");

const {
  successResponse,
} = require("../utils/response");

const {
  getAvailableExams,
  startExam: startExamService,
  saveAnswer,
} = require("../services/studentExam.service");

// =====================================
// GET AVAILABLE EXAMS
// =====================================

exports.getAvailableExams = asyncHandler(
  async (req, res) => {

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const search =
      req.query.search || "";

    const subject =
      req.query.subject || "";

    const sort =
      req.query.sort || "newest";

    const result =
      await getAvailableExams(

        req.user._id,

        page,

        limit,

        search,

        subject,

        sort

      );

    return successResponse(

      res,

      200,

      "Available exams fetched successfully.",

      result

    );

  }
);
// =====================================
// START EXAM
// =====================================

exports.startExam = asyncHandler(
  async (req, res) => {

    const { testId } = req.params;

    const result = await startExamService(
      req.user._id,
      testId
    );

    return successResponse(

      res,

      200,

      result.isResume
        ? "Exam resumed successfully."
        : "Exam started successfully.",

      result

    );

  }
);

// =====================================
// SAVE ANSWER
// =====================================

exports.saveAnswer = asyncHandler(
  async (req, res) => {

    const { attemptId } = req.params;

    const {
      questionId,
      selectedAnswer,
      currentQuestionIndex,
    } = req.body;

    const result = await saveAnswer(

      req.user._id,

      attemptId,

      questionId,

      selectedAnswer,

      currentQuestionIndex

    );

    return successResponse(
      res,
      200,
      "Answer saved successfully.",
      result
    );

  }
);