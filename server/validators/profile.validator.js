const validateProfile = (body) => {
  const errors = [];

  // School Name
  if (
    typeof body.schoolName !== "string" ||
    body.schoolName.trim().length < 3
  ) {
    errors.push("School Name is required.");
  }

  // Class
  if (
    typeof body.className !== "string" ||
    body.className.trim() === ""
  ) {
    errors.push("Class is required.");
  }
  //Roll
  if (
    body.rollNumber &&
    typeof body.rollNumber !== "string"
  ) {
    errors.push("Invalid Roll Number.");
  }
  //Dob
  if (
    body.dob &&
    isNaN(Date.parse(body.dob))
  ) {
    errors.push("Invalid Date of Birth.");
  }
  // Gender
  if (
    body.gender &&
    !["Male", "Female", "Other"].includes(body.gender)
  ) {
    errors.push("Invalid Gender.");
  }
  //Bio
  if (
    body.bio &&
    typeof body.bio !== "string"
  ) {
    errors.push("Bio must be a string.");
  }

  if (
    typeof body.bio === "string" &&
    body.bio.length > 250
  ) {
    errors.push(
      "Bio cannot exceed 250 characters."
    );
  }
  return errors;
};

module.exports = validateProfile;