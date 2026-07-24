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