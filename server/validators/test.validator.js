const mongoose = require("mongoose");

// =====================================
// CREATE TEST VALIDATION
// =====================================

const validateCreateTest = (data) => {

  const errors = [];

  const {
    title,
    subject,
    duration,
    startTime,
    endTime,
    questions,
  } = data;

  // =========================
  // Title
  // =========================

  if (!title || typeof title !== "string") {
    errors.push("Title is required.");
  } else if (title.trim().length < 3) {
    errors.push(
      "Title must contain at least 3 characters."
    );
  } else if (title.trim().length > 150) {
    errors.push(
      "Title cannot exceed 150 characters."
    );
  }

  // =========================
  // Subject
  // =========================

  if (!subject || typeof subject !== "string") {
    errors.push("Subject is required.");
  }

  // =========================
  // Duration
  // =========================

  if (
    duration === undefined ||
    duration === null ||
    Number(duration) <= 0
  ) {
    errors.push(
      "Duration must be greater than 0."
    );
  }

  // =========================
  // Start Time
  // =========================

  if (!startTime) {
    errors.push("Start time is required.");
  }

  // =========================
  // End Time
  // =========================

  if (!endTime) {
    errors.push("End time is required.");
  }

  // =========================
  // Date Validation
  // =========================

  if (startTime && endTime) {

    const start = new Date(startTime);

    const end = new Date(endTime);

    if (Number.isNaN(start.getTime())) {
      errors.push("Invalid start time.");
    }

    if (Number.isNaN(end.getTime())) {
      errors.push("Invalid end time.");
    }

    if (
      !Number.isNaN(start.getTime()) &&
      !Number.isNaN(end.getTime()) &&
      start >= end
    ) {
      errors.push(
        "End time must be greater than start time."
      );
    }
  }

  // =========================
  // Questions
  // =========================

  if (!Array.isArray(questions)) {

    errors.push(
      "Questions must be an array."
    );

  } else {

    if (questions.length === 0) {
      errors.push(
        "Select at least one question."
      );
    }

    const uniqueQuestions = [
      ...new Set(questions),
    ];

    if (
      uniqueQuestions.length !== questions.length
    ) {
      errors.push(
        "Duplicate questions are not allowed."
      );
    }

    for (const id of questions) {

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        errors.push(
          `Invalid question id : ${id}`
        );
      }

    }

  }

  return errors;

};

module.exports = {
  validateCreateTest,
};