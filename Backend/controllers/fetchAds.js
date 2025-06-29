const Ad = require("../models/adsModel");

// All fetch methods below support the hybrid schema:
// country, state, city (String) AND stateId, cityId, areaId (ObjectId refs)

const getAdsByAdvertiserId = async (req, res) => {
    const { id } = req.params;
    try {
        const ads = await Ad.find({ advertiserId: id })
            .populate("stateId", "name")
            .populate("cityId", "name")
            .populate("areaId", "name")
            .sort({ createdAt: -1 });

        // Each ad will have both string and populated ref fields if present
        res.status(200).json(ads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getAdsByCityId = async (req, res) => {
    const cityId = req.params.cityId;
    try {
        const adsByCity = await Ad.find({ cityId: cityId })
            .populate("stateId", "name")
            .populate("cityId", "name")
            .populate("areaId", "name");
        res.status(200).json({ message: "Ads by city:", ads: adsByCity });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getallAds = async (req, res) => {
    try {
        const ads = await Ad.find()
            .populate("stateId", "name")
            .populate("cityId", "name")
            .populate("areaId", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(ads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getParticularAdById = async (req, res) => {
    try {
        const { id } = req.params;
        const ad = await Ad.findById(id)
            .populate("stateId", "name")
            .populate("cityId", "name")
            .populate("areaId", "name");

        if (!ad) {
            return res.status(404).json({ message: "Ad not found" });
        }

        res.status(200).json(ad);
    } catch (error) {
        console.error("Error fetching ad:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getAdsByAdvertiserId,
    getAdsByCityId,
    getallAds,
    getParticularAdById,
};