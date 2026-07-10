const asyncHandler = require("../utils/asyncHandler");

const studentTestService = require("../services/studentTest.service");

exports.startTest = asyncHandler(async (req, res) => {

  const studentId = req.user.id;

  const { testId } = req.params;

  const result = await studentTestService.startTest(

    studentId,

    testId

  );

  res.status(200).json({

    success: true,

    message: "Test started successfully.",

    data: result,

  });

});