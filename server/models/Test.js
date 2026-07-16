const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    totalMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    startTime: {
      type: Date,
      required: true,
      index: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "draft",
        "published",
        "completed",
        "archived",
      ],
      default: "draft",
      index: true,
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

module.exports = mongoose.model("Test", testSchema);