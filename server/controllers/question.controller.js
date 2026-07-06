const validateQuestion = require("../validators/question.validator");

const { createQuestion } = require("../services/question.service");

exports.createQuestion = async (req, res) => {
  try {

    const errors = validateQuestion(req.body);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const question = await createQuestion({
      ...req.body,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Question created successfully.",
      question,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};