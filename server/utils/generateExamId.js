const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("0123456789", 6);

const generateExamId = () => {
  return `EXM${nanoid()}`;
};

module.exports = generateExamId;