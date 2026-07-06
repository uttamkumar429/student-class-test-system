const validateProfile = (body) => {
  const errors = [];

  // School Name
  if (!body.schoolName || body.schoolName.trim().length < 3) {
    errors.push("School Name is required.");
  }

  // Class
  if (!body.className || body.className.trim() === "") {
    errors.push("Class is required.");
  }

  // Gender
  if (
    body.gender &&
    !["Male", "Female", "Other"].includes(body.gender)
  ) {
    errors.push("Invalid Gender.");
  }

  return errors;
};

module.exports = validateProfile;