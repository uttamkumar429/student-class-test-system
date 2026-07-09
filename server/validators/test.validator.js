const validateTest = (data) => {

  const errors = [];

  // Title Validation
  if (!data.title || data.title.trim() === "") {
    errors.push("Title is required.");
  }

  // Subject Validation
  if (!data.subject || data.subject.trim() === "") {
    errors.push("Subject is required.");
  }

  // Duration Validation
  if (
    data.duration === undefined ||
    isNaN(data.duration) ||
    Number(data.duration) < 1
  ) {
    errors.push("Duration must be greater than 0.");
  }

 // Questions Validation
if (!Array.isArray(data.questions)) {

  errors.push("Questions must be an array.");

} else {

  if (data.questions.length === 0) {
    errors.push("At least one question is required.");
  }

  const hasEmptyQuestion = data.questions.some(
    (questionId) => !questionId
  );

  if (hasEmptyQuestion) {
    errors.push("Question ID cannot be empty.");
  }

}

  // Start Time Validation
  if (!data.startTime) {
    errors.push("Start Time is required.");
  }

  // End Time Validation
  if (!data.endTime) {
    errors.push("End Time is required.");
  }

  // Start Time < End Time
  if (data.startTime && data.endTime) {

    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (start >= end) {
      errors.push("End Time must be greater than Start Time.");
    }

  }

  return errors;

};

module.exports = validateTest;