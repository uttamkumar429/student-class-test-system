const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    examId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    className: {
      type: String,
      required: true,
      trim: true,
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    examDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Upcoming", "Completed", "Cancelled"],
      default: "Upcoming",
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

module.exports = mongoose.model("Exam", examSchema);