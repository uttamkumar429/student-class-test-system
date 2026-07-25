const Profile = require("../models/Profile");
const User = require("../models/User");
const validateProfile = require("../validators/profile.validator");

// ===============================
// GET PROFILE
// ===============================
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      userId: req.user._id,
    });

    res.status(200).json({
      success: true,
      data: {
        user: req.user,
        profile,
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ===============================
// UPDATE PROFILE
// ===============================
exports.updateProfile = async (req, res) => {
  try {

    // Validate Request
    const errors = validateProfile(req.body);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const {
      schoolName,
      className,
      section,
      rollNumber,
      dob,
      gender,
      state,
      district,
      bio,
    } = req.body;

    let profile = await Profile.findOne({
      userId: req.user._id,
    });

    // Create Profile if not exists
    if (!profile) {
      profile = await Profile.create({
        userId: req.user._id,
      });
    }

    // Update Profile
    Object.assign(profile, {
      schoolName,
      className,
      section,
      rollNumber,
      dob,
      gender,
      state,
      district,
      bio,
    });
    await profile.save();

    // Mark Profile Completed
    await User.findByIdAndUpdate(req.user._id, {
      profileCompleted: true,
    });

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      profile,
    });

  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};