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
        const cities = await cityModel.find().populate("stateId");
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
    console.log(stateId);
    try {
        const cities = await cityModel.find({ stateId: stateId });
        console.log(cities);
        res.status(200).json({ message: "Fetched succesfully", data: cities });
    } catch (error) {
        console.error("Server error", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { addCity, getCities, getCityByStateId };