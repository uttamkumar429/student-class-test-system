const validateQuestion = (data) => {
  const errors = [];

  // =====================================
  // SUBJECT
  // =====================================

  if (
    typeof data.subject !== "string" ||
    data.subject.trim() === ""
  ) {
    errors.push(
      "Subject is required."
    );
  } else if (
    data.subject.trim().length > 100
  ) {
    errors.push(
      "Subject cannot exceed 100 characters."
    );
  }

  // =====================================
  // CHAPTER
  // =====================================

  if (
    typeof data.chapter !== "string" ||
    data.chapter.trim() === ""
  ) {
    errors.push(
      "Chapter is required."
    );
  } else if (
    data.chapter.trim().length > 150
  ) {
    errors.push(
      "Chapter cannot exceed 150 characters."
    );
  }

  // =====================================
  // QUESTION
  // =====================================

  if (
    typeof data.question !== "string" ||
    data.question.trim() === ""
  ) {
    errors.push(
      "Question is required."
    );
  } else if (
    data.question.trim().length > 5000
  ) {
    errors.push(
      "Question cannot exceed 5000 characters."
    );
  }

  // =====================================
  // OPTIONS
  // =====================================

  const options = [
    "optionA",
    "optionB",
    "optionC",
    "optionD",
  ];

  for (const option of options) {
    if (
      typeof data[option] !== "string" ||
      data[option].trim() === ""
    ) {
      errors.push(
        `${option.replace(
          "option",
          "Option "
        )} is required.`
      );
    } else if (
      data[option].trim().length > 2000
    ) {
      errors.push(
        `${option.replace(
          "option",
          "Option "
        )} cannot exceed 2000 characters.`
      );
    }
  }

  // =====================================
  // CORRECT ANSWER
  // =====================================

  if (
    !["A", "B", "C", "D"].includes(
      data.correctAnswer
    )
  ) {
    errors.push(
      "Correct Answer must be A, B, C or D."
    );
  }

  // =====================================
  // DIFFICULTY
  // =====================================

  if (
    data.difficulty !== undefined &&
    (
      typeof data.difficulty !== "string" ||
      ![
        "Easy",
        "Medium",
        "Hard",
      ].includes(
        data.difficulty
      )
    )
  ) {
    errors.push(
      "Difficulty must be Easy, Medium or Hard."
    );
  }

  // =====================================
  // MARKS
  // =====================================

  if (
    data.marks === undefined ||
    data.marks === null ||
    data.marks === ""
  ) {
    errors.push(
      "Marks are required."
    );
  } else {
    const numericMarks =
      Number(data.marks);

    if (
      !Number.isFinite(
        numericMarks
      ) ||
      numericMarks < 1
    ) {
      errors.push(
        "Marks must be greater than or equal to 1."
      );
    } else if (
      numericMarks > 100
    ) {
      errors.push(
        "Marks cannot exceed 100."
      );
    }
  }

  // =====================================
  // EXPLANATION
  // =====================================

  if (
    data.explanation !== undefined &&
    data.explanation !== null &&
    typeof data.explanation !== "string"
  ) {
    errors.push(
      "Explanation must be a string."
    );
  } else if (
    typeof data.explanation === "string" &&
    data.explanation.trim().length > 5000
  ) {
    errors.push(
      "Explanation cannot exceed 5000 characters."
    );
  }

  return errors;
};

module.exports = validateQuestion;