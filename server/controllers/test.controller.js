const validateTest = require("../validators/test.validator");

const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const {
  successResponse,
  errorResponse,
} = require("../utils/response");

const {
  createTest: createTestService,
  getAllTests: getAllTestsService,
  getTestById: getTestByIdService,
  updateTest: updateTestService,
  deleteTest: deleteTestService,
} = require("../services/test.service");

// CREATE TEST

exports.createTest = asyncHandler(async (req, res) => {

  const errors = validateTest(req.body);

  if (errors.length) {
    return errorResponse(res, 400, errors);
  }

  const test = await createTestService({
    ...req.body,
    createdBy: req.user._id,
  });

  return successResponse(
    res,
    201,
    "Test created successfully.",
    test
  );

});

// GET ALL TESTS

exports.getAllTests = asyncHandler(async (req, res) => {

  const tests = await getAllTestsService();

  return successResponse(
    res,
    200,
    "Tests fetched successfully.",
    {
      total: tests.length,
      tests,
    }
  );

});
// GET TEST BY ID
exports.getTestById = asyncHandler(async (req, res) => {

  const test = await getTestByIdService(req.params.id);

  if (!test) {
    throw new ApiError(
        404,
        "Test not found."
    );
}

  return successResponse(
    res,
    200,
    "Test fetched successfully.",
    test
  );

});

// UPDATE TEST
exports.updateTest = asyncHandler(async (req, res) => {

  const errors = validateTest(req.body);

  if (errors.length) {
    return errorResponse(res, 400, errors);
  }

  const test = await updateTestService(
    req.params.id,
    req.body
  );

 if (!test) {
    throw new ApiError(
        404,
        "Test not found."
    );
}
  return successResponse(
    res,
    200,
    "Test updated successfully.",
    test
  );

});

// DELETE TEST
exports.deleteTest = asyncHandler(async (req, res) => {

  const test = await deleteTestService(req.params.id);

  if (!test) {
    throw new ApiError(
        404,
        "Test not found."
    );
}
  return successResponse(
    res,
    200,
    "Test deleted successfully."
  );

});