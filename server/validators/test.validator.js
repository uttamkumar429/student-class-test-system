const validateTest = (data) => {
  const errors = [];

  if (!data.title || data.title.trim() === "") {
    errors.push("Title is required.");
  }

  if (!data.subject || data.subject.trim() === "") {
    errors.push("Subject is required.");
  }

  if (
    data.duration === undefined ||
    isNaN(data.duration) ||
    Number(data.duration) < 1
  ) {
    errors.push("Duration must be greater than 0.");
  }

  if (!Array.isArray(data.questions)) {
    errors.push("Questions must be an array.");
  } else if (data.questions.length === 0) {
    errors.push("At least one question is required.");
  }

  if (!data.startTime) {
    errors.push("Start Time is required.");
  }

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