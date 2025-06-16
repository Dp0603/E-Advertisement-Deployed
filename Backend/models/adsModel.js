const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetAudience: { type: String, required: true },
    longitude_latitude: { type: String, required: true },
    adType: { type: String, required: true },
    adDimensions: { type: String },
    adDuration: { type: String, required: true },
    budget: { type: Number, required: true },
    adUrl: { type: String },
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: "State" },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
    areaId: { type: mongoose.Schema.Types.ObjectId, ref: "Area" },
    advertiserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Ad", adSchema);
