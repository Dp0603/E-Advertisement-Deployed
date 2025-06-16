const Ad = require("../models/adsModel");
const User = require("../models/userModel");

const saveAd = async (req, res) => {
    try {
        const userId = req.user.id;
        const { adId } = req.body;
        console.log("Ad ID received:", adId); 

        const ad = await Ad.findById(adId);
        if (!ad) {
            return res.status(404).json({ message: "Ad not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.savedAds.includes(adId)) {
            return res.status(400).json({ message: "Ad is already saved" });
        }

        user.savedAds.push(adId);
        await user.save();

        res.status(201).json({ message: "Ad saved successfully" });
    } catch (error) {
        console.error("Error saving ad:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getSavedAds = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate({
            path: "savedAds",
            populate: [
                { path: "stateId", select: "name" },
                { path: "cityId", select: "name" },
                { path: "areaId", select: "name" }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Fetched Saved Ads:", user.savedAds);
        res.status(200).json(user.savedAds);
    } catch (error) {
        console.error("Error fetching saved ads:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const removeSavedAd = async (req, res) => {
    try {
        const userId = req.user.id;
        const { adId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.savedAds.includes(adId)) {
            return res.status(404).json({ message: "Ad not found in saved ads" });
        }

        user.savedAds = user.savedAds.filter((id) => id.toString() !== adId);
        await user.save();

        res.status(200).json({ message: "Ad removed from saved ads" });
    } catch (error) {
        console.error("Error removing saved ad:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { saveAd, getSavedAds, removeSavedAd };
