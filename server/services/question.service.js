const Question = require("../models/Question");

const createQuestion = async (questionData) => {

  const question = await Question.create(questionData);

  return question;

};

module.exports = {
  createQuestion,
};