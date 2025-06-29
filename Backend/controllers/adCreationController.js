const Ad = require("../models/adsModel");
const cloudinaryMiddleware = require("../middleware/cloudinaryMiddleware");

// 🔹 Unified validation function
const validateAdFields = (data, res) => {
  const requiredFields = [
    "title",
    "description",
    "targetAudience",
    "longitude_latitude",
    "adType",
    "adDimensions",
    "adDuration",
    "budget",
  ];

  for (const field of requiredFields) {
    if (
      !data[field] ||
      (Array.isArray(data[field]) && data[field].length === 0)
    ) {
      res.status(400).json({ message: `Field '${field}' is required.` });
      return false;
    }
  }

  const hasCountryStateCity = data.country && data.state && data.city;
  const hasStateCityAreaId = data.stateId && data.cityId && data.areaId;

  if (!hasCountryStateCity && !hasStateCityAreaId) {
    res.status(400).json({
      message:
        "Please provide either (country, state, city) OR (stateId, cityId, areaId).",
    });
    return false;
  }

  return true;
};

// 🔹 Create Ad WITHOUT image
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
      country,
      state,
      city,
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
      country,
      state,
      city,
      stateId,
      cityId,
      areaId,
      isFeatured: isFeatured || false,
      advertiserId: req.user.id,
    };

    if (!validateAdFields(newAdData, res)) return;

    const newAd = await new Ad(newAdData).save();

    const populatedAd = await Ad.findById(newAd._id)
      .populate("stateId", "name")
      .populate("cityId", "name")
      .populate("areaId", "name");

    res
      .status(201)
      .json({ message: "Ad created successfully", ad: populatedAd });
  } catch (error) {
    console.error("Create Ad error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔹 Create Ad WITH file
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
      country,
      state,
      city,
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
      country,
      state,
      city,
      stateId,
      cityId,
      areaId,
      isFeatured: isFeatured || false,
      advertiserId: req.user.id,
    };

    if (!validateAdFields(newAdData, res)) return;

    const newAd = await new Ad(newAdData).save();

    const populatedAd = await Ad.findById(newAd._id)
      .populate("stateId", "name")
      .populate("cityId", "name")
      .populate("areaId", "name");

    res.status(201).json({ message: "Ad with image created", ad: populatedAd });
  } catch (error) {
    console.error("Create Ad with File error:", error);
    res.status(500).json({ message: "Error saving ad", error: error.message });
  }
};

// 🔹 Update Ad WITHOUT file
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

// 🔹 Update Ad WITH file
const updateAdsWithFile = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

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
