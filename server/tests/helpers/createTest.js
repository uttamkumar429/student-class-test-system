const Test = require("../../models/Test");

const createTest = async (
  adminId,
  questionIds,
  overrides = {}
) => {
  return await Test.create({
    title: "Physics Mock Test",

    subject: "Physics",

    description: "Mock Test",

    duration: 60,

    startTime: new Date(Date.now() + 60 * 60 * 1000),

    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),

    questions: questionIds,

    totalMarks: questionIds.length,

    totalQuestions: questionIds.length,

    createdBy: adminId,

    ...overrides,
  });
};

module.exports = createTest;