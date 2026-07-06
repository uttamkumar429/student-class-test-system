const validateTest = require("../validators/test.validator");
const { createTest } = require("../services/test.service");

// ===============================
// CREATE TEST
// ===============================
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