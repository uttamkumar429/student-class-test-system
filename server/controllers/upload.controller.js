const cloudinary = require("../config/cloudinary");
const Profile = require("../models/Profile");

exports.uploadProfilePhoto = asyncHandler(async (req, res) => {
  try {

    if (!req.file) {
      throw new ApiError(400, "Please select an image.");
    }

    const image = req.file.buffer.toString("base64");

    const uploadedImage = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${image}`,
      {
        folder: "student-profile",
      }
    );

    let profile = await Profile.findOne({
      userId: req.user._id,
    });
    
    // Delete old image if exists
    if (
      profile &&
      profile.cloudinaryPublicId &&
      profile.cloudinaryPublicId.trim() !== ""
    ) {
      await cloudinary.uploader.destroy(profile.cloudinaryPublicId);
    }

    
    if (!profile) {
      profile = await Profile.create({
        userId: req.user._id,
      });
    }

    profile.profilePhoto = uploadedImage.secure_url;
    profile.cloudinaryPublicId = uploadedImage.public_id;

    await profile.save();

    return successResponse(
      res,
      200,
      "Profile photo uploaded successfully.",
      {
        profilePhoto: profile.profilePhoto,
      }
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Image upload failed.",
    });

  }
});