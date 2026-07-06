const validateQuestion = require("../validators/question.validator");

const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require("../services/question.service");
// CREATE QUESTION

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


// GET ALL QUESTIONS

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await getAllQuestions();

    return res.status(200).json({
      success: true,
      total: questions.length,
      questions,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// ===============================
// GET QUESTION BY ID
// ===============================
exports.getQuestionById = async (req, res) => {
  try {

    const question = await getQuestionById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      success: true,
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


// UPDATE QUESTION

exports.updateQuestion = async (req, res) => {
  try {

    const errors = validateQuestion(req.body);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const question = await updateQuestion(
      req.params.id,
      req.body
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question updated successfully.",
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

// DELETE QUESTION

exports.deleteQuestion = async (req, res) => {
  try {

    const question = await deleteQuestion(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question deleted successfully.",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};