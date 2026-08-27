const mongoose = require("mongoose");

const snapshotQuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    subject: String,

    chapter: String,

    difficulty: String,

    question: String,

    optionA: String,

    optionB: String,

    optionC: String,

    optionD: String,

    correctAnswer: String,

    explanation: String,
        // =====================================
    // HINDI TRANSLATION
    // =====================================

    questionHindi: String,

    optionAHindi: String,

    optionBHindi: String,

    optionCHindi: String,

    optionDHindi: String,

    explanationHindi: String,

    marks: Number,
  },
  
);

const testSnapshotSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
      unique: true,
    },

    title: String,

    subject: String,

    duration: Number,

    totalMarks: Number,

    totalQuestions: Number,

    startTime: Date,

    endTime: Date,

    publishedAt: {
      type: Date,
      default: Date.now,
    },

    questions: [snapshotQuestionSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "TestSnapshot",
  testSnapshotSchema
);