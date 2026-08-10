const { errorResponse } = require("../utils/response");
const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  // File upload size limit
  if (err.code === "LIMIT_FILE_SIZE") {
    return errorResponse(
      res,
      400,
      "Image size must not exceed 2 MB."
    );
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    return errorResponse(
      res,
      409,
      "A record with the same details already exists."
    );
  }

  // MongoDB Invalid ObjectId
  if (err.name === "CastError") {
    return errorResponse(
      res,
      400,
      "Invalid ID."
    );
  }

  return errorResponse(
    res,
    err.statusCode || 500,
    err.message || "Internal Server Error"
  );
};

module.exports = errorHandler;