// const { errorResponse } = require("../utils/response");

// const errorHandler = (err, req, res, next) => {
//   console.error(err);

//   return errorResponse(
//     res,
//     err.statusCode || 500,
//     err.message || "Internal Server Error"
//   );
// };

// module.exports = errorHandler;
const { errorResponse } = require("../utils/response");

const errorHandler = (err, req, res, next) => {

  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    return next(
      new ApiError(400, "Image size must not exceed 2 MB.")
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