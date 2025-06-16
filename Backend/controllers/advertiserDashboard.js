const mongoose = require("mongoose");
const user = require("../models/userModel");

const getAdDashboard = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        // 2. Convert both IDs to ObjectIds for comparison.  This is CRUCIAL.
        let reqUserId;
        try {
            reqUserId = new mongoose.Types.ObjectId(req.user.id); // Convert req.user.id to ObjectId
        } catch (err) {
            ~
                console.error("Error converting req.user.id to ObjectId:", err); // Log the error
            return res.status(400).json({ message: "Invalid user ID format" }); // Return an error response
        }
        const paramId = new mongoose.Types.ObjectId(id); //Ensuring id is also an ObjectId

        // 3. Compare the ObjectIds using .equals()
        if (!reqUserId.equals(paramId)) {
            return res.status(403).json({ message: "Forbidden! You don't have access" });
        }

        // 4. Fetch the advertiser data
        const advertiserData = await user.findById(id); // No need to convert id again; it's already validated

        if (!advertiserData) {
            return res.status(404).json({ message: "No advertiser data found" });
        }

        // 5. Send a success response
        res.status(200).json({ message: `Hello ${advertiserData.firstName}, welcome to advertiser dashboard` }); // Use advertiserData.firstname

    } catch (error) {
        // 6. Handle errors properly
        console.error("Error in getAdDashboard:", error); // Log the full error
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getAdDashboard };
