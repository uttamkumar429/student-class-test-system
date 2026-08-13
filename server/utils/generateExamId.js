// =====================================
// GENERATE EXAM ID
// =====================================

const generateExamId = () => {
  const timestamp =
    Date.now()
      .toString(36)
      .toUpperCase();

  const randomPart =
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

  return `EXAM-${timestamp}-${randomPart}`;
};

module.exports = generateExamId;