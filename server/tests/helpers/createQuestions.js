const Question = require("../../models/Question");
const questions = require("../fixtures/questions");

const createQuestions = async (adminId) => {
  const docs = questions.map((q) => ({
    ...q,
    createdBy: adminId,
  }));

  return await Question.insertMany(docs);
};

module.exports = createQuestions;