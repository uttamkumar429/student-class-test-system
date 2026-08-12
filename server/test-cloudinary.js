require("dotenv").config();

const cloudinary = require("./config/cloudinary");

(async () => {
  try {
    const result = await cloudinary.api.ping();

    console.log("CLOUDINARY PING SUCCESS:");
    console.log(result);
  } catch (error) {
    console.error("CLOUDINARY PING FAILED:");
    console.error(error);
  }
})();