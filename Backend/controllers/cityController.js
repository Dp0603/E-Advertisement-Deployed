const cityModel = require("../models/cityModel");

const addCity = async (req, res) => {
    try {
        const savedCity = await cityModel.create(req.body);
        res.status(201).json({
            message: "City added succesfully",
            data: savedCity
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const getCities = async (req, res) => {
    try {
        // Sort cities alphabetically by name
        const cities = await cityModel.find().populate("stateId").sort({ name: 1 });
        res.status(200).json({
            message: "All cities",
            data: cities
        });
    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
};

const getCityByStateId = async (req, res) => {
    stateId = req.params.stateId;
    try {
        const cities = await cityModel.find({ stateId: stateId }).sort({ name: 1 });
        res.status(200).json({ message: "Fetched succesfully", data: cities });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { addCity, getCities, getCityByStateId };