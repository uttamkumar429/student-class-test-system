const { errorResponse } = require("../utils/response");

const validate = (validator) => {
  return (req, res, next) => {
    const errors = validator(req.body);

    if (errors.length) {
      return errorResponse(res, 400, errors);
    }

    next();
  };
};

module.exports = validate;