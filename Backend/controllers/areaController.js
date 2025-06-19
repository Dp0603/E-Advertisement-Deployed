const areaModel = require("../models/areaModel");


const addArea = async (req, res) => {
    try {
        const { name, cityId, stateId, pinCode } = req.body;
        const area = new areaModel(
            {
                name,
                cityId,
                stateId,
                pinCode
            }
        )
        await area.save();
        res.status(201).json({
            message: "Area added successfully",
            data: area
        });
    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
};

const getAreas = async (req, res) => {
    try {
        // Sort areas alphabetically by name
        const areas = await areaModel.find().populate("cityId").populate("stateId").sort({ name: 1 });
        res.status(200).json({
            message: "All Areas",
            data: areas
        });
    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
};

const getAreaByCity = async (req, res) => {
    cityId = req.params.cityId;
    try {
        const areas = await areaModel.find({ cityId: cityId }).sort({ name: 1 });
        res.status(200).json({ message: "Areas fetched ", data: areas });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { addArea, getAreas, getAreaByCity };