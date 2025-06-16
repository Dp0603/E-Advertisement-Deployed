require("dotenv").config;
const cloudinary = require("cloudinary").v2;

const uploadFile = async (file) => {
    cloudinary.config({
        cloud_name: "ds8wjvznw",
        api_key: process.env.API_KEY_CLOUDINARY,
        api_secret: process.env.API_SECRET_CLOUDINARY
    })

    const cloudinaryResponse = await cloudinary.uploader.upload(file.path);
    return cloudinaryResponse;
}

module.exports = { uploadFile }
