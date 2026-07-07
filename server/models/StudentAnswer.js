const mongoose = require("mongoose");

const studentAnswerSchema = new mongoose.Schema(
  {
    attempt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamAttempt",
      required: true,
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    selectedAnswer: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true,
    },

    correctAnswer: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true,
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },

    marksAwarded: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "StudentAnswer",
  studentAnswerSchema
);