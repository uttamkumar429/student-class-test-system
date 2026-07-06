const validateTest = require("../validators/test.validator");

const {
  createTest,
  getAllTests,
  getTestById,
  updateTest: updateTestService,
} = require("../services/test.service");

// CREATE TEST

exports.createTest = async (req, res) => {
  try {
    const errors = validateTest(req.body);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const test = await createTest({
      ...req.body,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Test created successfully.",
      test,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// GET ALL TESTS

exports.getAllTests = async (req, res) => {
  try {

    const tests = await getAllTests();

    return res.status(200).json({
      success: true,
      total: tests.length,
      tests,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// GET TEST BY ID
exports.getTestById = async (req, res) => {

  try {

    const test = await getTestById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found."
      });
    }

    return res.status(200).json({
      success: true,
      test,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    });

  }

};

// UPDATE TEST
exports.updateTest = async (req, res) => {

  try {

    const errors = validateTest(req.body);

    if (errors.length) {

      return res.status(400).json({
        success: false,
        errors,
      });

    }

   const test = await updateTestService(
    req.params.id,
    req.body
);

    if (!test) {

      return res.status(404).json({
        success: false,
        message: "Test not found.",
      });

    }

    return res.status(200).json({
      success: true,
      message: "Test updated successfully.",
      test,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};