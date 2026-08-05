const asyncHandler = require("../middleware/asyncHandler");

const {
  successResponse,
} = require("../utils/response");

const {
  getAvailableExams,
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