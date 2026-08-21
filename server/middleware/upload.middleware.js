const multer = require("multer");
const path = require("path");

// ======================================
// MEMORY STORAGE
// ======================================

const storage = multer.memoryStorage();

// ======================================
// ALLOWED IMAGE MIME TYPES
// ======================================

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

// ======================================
// ALLOWED IMAGE EXTENSIONS
// ======================================

const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

// ======================================
// FILE FILTER
// ======================================

const fileFilter = (req, file, cb) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  console.log("Uploaded file:", {
    originalname: file.originalname,
    mimetype: file.mimetype,
    extension,
    fieldname: file.fieldname,
  });

  const validMimeType =
    allowedMimeTypes.includes(file.mimetype);

  const validExtension =
    allowedExtensions.includes(extension);

  // Accept valid MIME type
  if (validMimeType) {
    return cb(null, true);
  }

  // Some systems/Postman may send images
  // as application/octet-stream
  if (
    file.mimetype === "application/octet-stream" &&
    validExtension
  ) {
    return cb(null, true);
  }

  return cb(
    new Error(
      `Only JPG, JPEG, PNG and WEBP image files are allowed. Received: ${file.mimetype}`
    ),
    false
  );
};

// ======================================
// MULTER CONFIGURATION
// ======================================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

module.exports = upload;