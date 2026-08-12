const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    chapter: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
      index: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    optionA: {
      type: String,
      required: true,
    },

    optionB: {
      type: String,
      required: true,
    },

    optionC: {
      type: String,
      required: true,
    },

    optionD: {
      type: String,
      required: true,
    },

    correctAnswer: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true,
    },

    explanation: {
      type: String,
      default: "",
    },

    marks: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);