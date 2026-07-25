const validateQuestion = (data) => {
  const errors = [];

  if (
    typeof data.subject !== "string" ||
    data.subject.trim() === ""
  ) {
    errors.push("Subject is required.");
  }

  if (
    typeof data.chapter !== "string" ||
    data.chapter.trim() === ""
  ) {
    errors.push("Chapter is required.");
  }
  if (
    typeof data.question !== "string" ||
    data.question.trim() === ""
  ) {
    errors.push("Question is required.");
  }

  if (
    typeof data.optionA !== "string" ||
    data.optionA.trim() === ""
  ) {
    errors.push("Option A is required.");
  }

if (
  typeof data.optionB !== "string" ||
  data.optionB.trim() === ""
) {
  errors.push("Option B is required.");
}

if (
  typeof data.optionC !== "string" ||
  data.optionC.trim() === ""
) {
  errors.push("Option C is required.");
}
if (
  typeof data.optionD !== "string" ||
  data.optionD.trim() === ""
) {
  errors.push("Option D is required.");
}

  if (!["A", "B", "C", "D"].includes(data.correctAnswer)) {
    errors.push("Correct Answer must be A, B, C or D.");
  }

  if (
    data.difficulty &&
    (
      typeof data.difficulty !== "string" ||
      !["Easy", "Medium", "Hard"].includes(data.difficulty)
    )
  ) {
    errors.push("Difficulty must be Easy, Medium or Hard.");
  }

  if (
    data.marks !== undefined &&
    (
      !Number.isFinite(Number(data.marks)) ||
      Number(data.marks) < 1
    )
  ) {
    errors.push("Marks must be greater than or equal to 1.");
  }

  return errors;
};

module.exports = validateQuestion;