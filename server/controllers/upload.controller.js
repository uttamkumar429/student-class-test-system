const cloudinary = require("../config/cloudinary");
const Profile = require("../models/Profile");

const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const {
  successResponse,
} = require("../utils/response");

// ======================================
// UPLOAD PROFILE PHOTO
// ======================================

exports.uploadProfilePhoto = asyncHandler(
  async (req, res) => {
    if (!req.file) {
      throw new ApiError(
        400,
        "Please select an image."
      );
    }

    const image =
      req.file.buffer.toString("base64");

    const uploadedImage =
      await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${image}`,
        {
          folder: "student-profile",
        }
      );

    let profile =
      await Profile.findOne({
        userId: req.user._id,
      });

    // --------------------------------------
    // Delete old Cloudinary image
    // --------------------------------------

    if (
      profile &&
      profile.cloudinaryPublicId &&
      profile.cloudinaryPublicId.trim() !== ""
    ) {
      await cloudinary.uploader.destroy(
        profile.cloudinaryPublicId
      );
    }

    // --------------------------------------
    // Create profile if missing
    // --------------------------------------

    if (!profile) {
      profile = await Profile.create({
        userId: req.user._id,
      });
    }

    // --------------------------------------
    // Save new photo
    // --------------------------------------

    profile.profilePhoto =
      uploadedImage.secure_url;

    profile.cloudinaryPublicId =
      uploadedImage.public_id;

    await profile.save();

    return successResponse(
      res,
      200,
      "Profile photo uploaded successfully.",
      {
        profilePhoto:
          profile.profilePhoto,
      }
    );
  }
);