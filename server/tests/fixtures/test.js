const mongoose = require("mongoose");

module.exports = {
  validTest: {
    title: "Class 12 Physics Test 1",

    subject: "Physics",

    description: "Chapter 1 Test",

    duration: 60,

    startTime: new Date(Date.now() + 60 * 60 * 1000),

    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),

    questions: [], // runtime me fill hoga
  },
};