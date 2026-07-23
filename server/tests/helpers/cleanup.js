const User = require("../../models/User");
const Question = require("../../models/Question");
const Test = require("../../models/Test");
const TestSnapshot = require("../../models/TestSnapshot");
const ExamAttempt = require("../../models/ExamAttempt");

const cleanup = async () => {

  await User.deleteMany({});

  await Question.deleteMany({});

  await Test.deleteMany({});

  await TestSnapshot.deleteMany({});

  await ExamAttempt.deleteMany({});

};

module.exports = cleanup;