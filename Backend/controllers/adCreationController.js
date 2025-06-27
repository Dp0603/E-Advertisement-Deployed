const Ad = require("../models/adsModel");
const cloudinaryMiddleware = require("../middleware/cloudinaryMiddleware");

// Helper: Validate required fields
const validateAdFields = (fields, res) => {
  const required = [
    "title",
    "description",
    "targetAudience",
    "longitude_latitude",
    "adType",
    "adDimensions",
    "adDuration",
    "budget",
    "stateId",
    "cityId",
    "areaId",
  ];

  for (const key of required) {
    if (
      !fields[key] ||
      (Array.isArray(fields[key]) && fields[key].length === 0)
    ) {
      res.status(400).json({ message: `Field '${key}' is required.` });
      return false;
    }
  }
  return true;
};

// 🔹 Create Ad WITHOUT image (JSON body)
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

    const audienceArray = Array.isArray(targetAudience)
      ? targetAudience
      : typeof targetAudience === "string"
      ? targetAudience.split(",").map((a) => a.trim())
      : [];

    const newAdData = {
      title,
      description,
      targetAudience: audienceArray,
      longitude_latitude,
      adType,
      adDimensions,
      adDuration,
      budget,
      adUrl,
      stateId,
      cityId,
      areaId,
      isFeatured: isFeatured || false,
      advertiserId: req.user.id,
    };

    if (!validateAdFields(newAdData, res)) return;

    const newAd = new Ad(newAdData);
    await newAd.save();

    const populatedAd = await Ad.findById(newAd._id)
      .populate("stateId", "name")
      .populate("cityId", "name")
      .populate("areaId", "name");

    res
      .status(201)
      .json({ message: "Ad successfully created", ad: populatedAd });
  } catch (error) {
    console.error("Create Ad error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔹 Create Ad WITH file upload
const createAdsWithFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const uploaded = await cloudinaryMiddleware.uploadFile(req.file);
    const adUrl = uploaded.secure_url;

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

    const audienceArray = Array.isArray(targetAudience)
      ? targetAudience
      : typeof targetAudience === "string"
      ? targetAudience.split(",").map((a) => a.trim())
      : [];

    const newAdData = {
      title,
      description,
      targetAudience: audienceArray,
      longitude_latitude,
      adType,
      adDimensions,
      adDuration,
      budget,
      adUrl,
      stateId,
      cityId,
      areaId,
      isFeatured: isFeatured || false,
      advertiserId: req.user.id,
    };

    if (!validateAdFields(newAdData, res)) return;

    const newAd = new Ad({ ...newAdData, adUrl });
    await newAd.save();

    const populatedAd = await Ad.findById(newAd._id)
      .populate("stateId", "name")
      .populate("cityId", "name")
      .populate("areaId", "name");

    return res
      .status(201)
      .json({ message: "Ad with image created", ad: populatedAd });
  } catch (error) {
    console.error("Create Ad with File error:", error);
    return res
      .status(500)
      .json({ message: "Error saving ad", error: error.message });
  }
};

// 🔹 Update Ad WITHOUT image
const updateAds = async (req, res) => {
  try {
    const updated = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Ad updated", ad: updated });
  } catch (error) {
    console.error("Update Ad error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 🔹 Update Ad WITH image
const updateAdsWithFile = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    let adUrl = ad.adUrl;

    if (req.file) {
      const uploaded = await cloudinaryMiddleware.uploadFile(req.file);
      adUrl = uploaded.secure_url;
    }

    const updated = await Ad.findByIdAndUpdate(
      req.params.id,
      { ...req.body, adUrl },
      { new: true }
    );

    res.status(200).json({ message: "Ad updated with image", ad: updated });
  } catch (error) {
    console.error("Update Ad with File error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createAds,
  createAdsWithFile,
  updateAds,
  updateAdsWithFile,
};
