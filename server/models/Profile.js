const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    profilePhoto: {
      type: String,
      default: "",
    },
    cloudinaryPublicId: {
       type: String,
       default: ""
    },
    
    schoolName: {
      type: String,
      trim: true,
    },

    className: {
      type: String,
      trim: true,
    },

    section: {
      type: String,
      trim: true,
    },

    rollNumber: {
      type: String,
      trim: true,
    },

    dob: Date,

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    state: String,

    district: String,

    bio: {
      type: String,
      maxlength: 250,
      default: "",
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);