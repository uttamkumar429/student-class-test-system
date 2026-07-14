const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== "object") return;

  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
      continue;
    }

    sanitizeObject(obj[key]);
  }
};

const mongoSanitize = (req, res, next) => {
  // Only sanitize mutable objects
  sanitizeObject(req.body);
  sanitizeObject(req.params);

  // Express 5: don't mutate req.query directly
  if (req.query && typeof req.query === "object") {
    sanitizeObject(req.query);
  }

  next();
};

module.exports = mongoSanitize;