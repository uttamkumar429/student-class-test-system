const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const {
  successResponse,
 
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

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const sort = req.query.sort || "newest";
  const status = req.query.status || "";
  const subject = req.query.subject || "";
  const search = req.query.search || "";

  const startDate = req.query.startDate || "";
  const endDate = req.query.endDate || "";
  const duration = req.query.duration || "";

  const result = await getAllTestsService(
    page,
    limit,
    sort,
    status,
    subject,
    search,
    startDate,
    endDate,
    duration
  );

  return successResponse(
    res,
    200,
    "Tests fetched successfully.",
    result
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