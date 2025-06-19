const stateModel = require("../models/stateModel");

const addState = async (req, res) => {
    try {
        const savedState = await stateModel.create(req.body);
        res.status(201).json({
            message: "State Added Successfully.",
            data: savedState
        });
    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
};


const getAllStates = async (req, res) => {
    try {
        // Sort states alphabetically by name
        const states = await stateModel.find().sort({ name: 1 });
        res.status(200).json({
            message: "All States Fetched Successfully.",
            data: states
        });
    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
};

module.exports = { addState, getAllStates }