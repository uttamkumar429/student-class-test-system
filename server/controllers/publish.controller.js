const {
    publishTest: publishTestService,
} = require("../services/publish.service");
// ===============================
// PUBLISH TEST
// ===============================
exports.publishTest = async (req, res) => {
  try {

    const test = await publishTestService(
    req.params.id
);

    return res.status(200).json({
      success: true,
      message: "Test published successfully.",
      test,
    });

  } catch (error) {

    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};