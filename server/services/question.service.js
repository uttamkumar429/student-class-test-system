const Question = require("../models/Question");

// CREATE
const createQuestion = async (questionData) => {
  return await Question.create(questionData);
};

const getAllQuestions = async () => {

  const total = await Question.countDocuments();

  const questions = await Question.find()
    .populate("createdBy", "fullName email")
    .sort({ createdAt: -1 });

  return {
    total,
    questions,
  };

};
// GET BY ID
const getQuestionById = async (id) => {
  return await Question.findById(id).populate(
    "createdBy",
    "fullName email"
  );
};

// UPDATE
const updateQuestion = async (id, data) => {
  return await Question.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  ).populate("createdBy", "fullName email");
};

const deleteQuestion = async (id) => {
  return await Question.findByIdAndDelete(id);
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};