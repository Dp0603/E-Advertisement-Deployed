const Ad = require("../models/adsModel");
const multer = require("multer");
const path = require("path");
const cloudinaryMiddleware = require("../middleware/cloudinaryMiddleware");

const storage = multer.diskStorage({
    destination: "./uploads",
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const upload = multer({
    storage: storage,
}).single("image");

const createAds = async (req, res) => {
    try {
        const { title, description, targetAudience, longitude_latitude, adType, adDimensions, adDuration, budget, adUrl, stateId, cityId, areaId } = req.body;
        if (!title || !description || !targetAudience || !budget || !adType || !adDuration) {
            return res.status(400).json({ message: "All fields are empty" });
        }
        const newAds = new Ad({
            title,
            description,
            targetAudience,
            longitude_latitude,
            adType,
            adDimensions,
            adDuration,
            budget,
            adUrl,
            stateId,
            cityId,
            areaId,
            advertiserId: req.user.id

        })
        await newAds.save();

        const populatedAd = await Ad.findById(newAds._id)
            .populate("stateId", "name")
            .populate("cityId", "name")
            .populate("areaId", "name")
        console.log(populatedAd.areaId);

        res.status(200).json({ message: "Ad succesfully created", ad: populatedAd })


    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

const updateAds = async (req, res) => {
    try {



        const updatedAds = await Ad.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.status(201).json({ message: "Ads updated:", data: updatedAds })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }


}

const createAdsWithFile = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal server error" });
        }

        try {
            // Try uploading the file to cloudinary
            const cloudinaryResponse = await cloudinaryMiddleware.uploadFile(req.file);
            console.log(cloudinaryResponse);
            req.body.adUrl = cloudinaryResponse.secure_url;

            // Try creating the ad
            const newAds = await Ad.create(req.body);
            return res.status(200).json({ message: "Ad saved", data: newAds });
        } catch (error) {
            // Catch any errors that occur during the file upload or ad creation
            console.log(error);
            return res.status(500).json({ message: "Error uploading file", error: error.message });
        }
    });
};



const updateAdsWithFile = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "File upload failed" });
        }

        try {

            const existingAd = await Ad.findById(req.params.id);
            if (!existingAd) {
                return res.status(404).json({ message: "Ad not found" });
            }

            let adUrl = existingAd.adUrl;

            if (req.file) {

                const cloudinaryResponse = await cloudinaryMiddleware.uploadFile(req.file);
                adUrl = cloudinaryResponse.secure_url;
            }


            const updatedAd = await Ad.findByIdAndUpdate(
                req.params.id,
                { ...req.body, adUrl },
                { new: true }
            );

            res.status(200).json({ message: "Ad updated successfully", data: updatedAd });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
}

module.exports = { createAds, createAdsWithFile, updateAds, updateAdsWithFile };