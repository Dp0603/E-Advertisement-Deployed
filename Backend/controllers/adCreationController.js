const Ad = require("../models/adsModel");
const cloudinaryMiddleware = require("../middleware/cloudinaryMiddleware");

// Create Ad WITHOUT file upload (JSON body)
const createAds = async (req, res) => {
  try {
    const {
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
      isFeatured,
    } = req.body;

    console.log("REQ.USER:", req.user);
    console.log("REQ.BODY:", req.body);

    if (
      !title ||
      !description ||
      !targetAudience ||
      !adType ||
      !adDuration ||
      !budget
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const newAd = new Ad({
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
      isFeatured,
      advertiserId: req.user.id,
    });

    await newAd.save();

    const populatedAd = await Ad.findById(newAd._id)
      .populate("stateId", "name")
      .populate("cityId", "name")
      .populate("areaId", "name");

    res.status(200).json({ message: "Ad successfully created", ad: populatedAd });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Create Ad WITH file upload (multipart/form-data)
const createAdsWithFile = async (req, res) => {
  try {
    // Check for file
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Upload to cloudinary
    const cloudinaryResponse = await cloudinaryMiddleware.uploadFile(req.file);
    const adUrl = cloudinaryResponse.secure_url;

    const {
      title,
      description,
      targetAudience,
      longitude_latitude,
      adType,
      adDimensions,
      adDuration,
      budget,
      stateId,
      cityId,
      areaId,
      isFeatured,
    } = req.body;

    if (
      !title ||
      !description ||
      !targetAudience ||
      !adType ||
      !adDuration ||
      !budget
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const newAd = new Ad({
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
      isFeatured,
      advertiserId: req.user.id,
    });

    await newAd.save();

    const populatedAd = await Ad.findById(newAd._id)
      .populate("stateId", "name")
      .populate("cityId", "name")
      .populate("areaId", "name");

    return res.status(200).json({ message: "Ad saved", ad: populatedAd });
  } catch (error) {
    console.error("Create ad error:", error);
    return res.status(500).json({ message: "Error saving ad", error: error.message });
  }
};

// Update Ad WITHOUT file
const updateAds = async (req, res) => {
  try {
    const updatedAd = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({ message: "Ad updated", ad: updatedAd });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Ad WITH file
const updateAdsWithFile = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    let adUrl = ad.adUrl;

    if (req.file) {
      const cloudinaryResponse = await cloudinaryMiddleware.uploadFile(req.file);
      adUrl = cloudinaryResponse.secure_url;
    }

    const updatedAd = await Ad.findByIdAndUpdate(
      req.params.id,
      { ...req.body, adUrl },
      { new: true }
    );

    res.status(200).json({ message: "Ad updated successfully", ad: updatedAd });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createAds,
  createAdsWithFile,
  updateAds,
  updateAdsWithFile,
};
