// const {
//     publishTest: publishTestService,
// } = require("../services/publish.service");
// // ===============================
// // PUBLISH TEST
// // ===============================
// exports.publishTest = async (req, res) => {
//   try {

//     const test = await publishTestService(
//     req.params.id
// );

//     return res.status(200).json({
//       success: true,
//       message: "Test published successfully.",
//       test,
//     });

//   } catch (error) {

//     console.error(error);

//     return res.status(400).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };
const asyncHandler = require("../middleware/asyncHandler");

const {
  successResponse,
} = require("../utils/response");

const {
  publishTest: publishTestService,
} = require("../services/publish.service");

// =====================================
// PUBLISH TEST
// =====================================
exports.publishTest = asyncHandler(async (req, res) => {

  const test = await publishTestService(req.params.id);

  return successResponse(
    res,
    200,
    "Test published successfully.",
    test
  );

});