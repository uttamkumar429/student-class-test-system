const validateQuestion = (data) => {
  const errors = [];

  if (!data.subject || data.subject.trim() === "") {
    errors.push("Subject is required.");
  }

  if (!data.chapter || data.chapter.trim() === "") {
    errors.push("Chapter is required.");
  }

  if (!data.question || data.question.trim() === "") {
    errors.push("Question is required.");
  }

  if (!data.optionA || data.optionA.trim() === "") {
    errors.push("Option A is required.");
  }

  if (!data.optionB || data.optionB.trim() === "") {
    errors.push("Option B is required.");
  }

  if (!data.optionC || data.optionC.trim() === "") {
    errors.push("Option C is required.");
  }

  if (!data.optionD || data.optionD.trim() === "") {
    errors.push("Option D is required.");
  }

  if (!["A", "B", "C", "D"].includes(data.correctAnswer)) {
    errors.push("Correct Answer must be A, B, C or D.");
  }

  if (
    data.difficulty &&
    !["Easy", "Medium", "Hard"].includes(data.difficulty)
  ) {
    errors.push("Difficulty must be Easy, Medium or Hard.");
  }

  if (
    data.marks !== undefined &&
    (isNaN(data.marks) || Number(data.marks) < 1)
  ) {
    errors.push("Marks must be greater than or equal to 1.");
  }

  return errors;
};

module.exports = validateQuestion;