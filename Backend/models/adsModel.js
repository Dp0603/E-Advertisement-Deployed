const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetAudience: { type: [String], required: true },
    longitude_latitude: { type: String, required: true },
    adType: { type: String, required: true },
    adDimensions: { type: String, required: true },
    adDuration: { type: String, required: true },
    budget: { type: String, required: true },
    adUrl: { type: String },
    // New fields for country-state-city dropdown
    country: { type: String },
    state: { type: String },
    city: { type: String },
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: false, // now optional
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: false,
    },
    areaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      required: false,
    },
    isFeatured: { type: Boolean, default: false },
    advertiserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ad", adSchema);
