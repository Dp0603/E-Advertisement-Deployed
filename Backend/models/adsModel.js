const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetAudience: { type: [String], required: true }, // <-- now array of strings
    longitude_latitude: { type: String, required: true },
    adType: { type: String, required: true },
    adDimensions: { type: String, required: true }, // <-- required for consistency with frontend
    adDuration: { type: String, required: true },
    budget: { type: String, required: true },
    adUrl: { type: String },
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    areaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      required: true,
    },
    isFeatured: { type: Boolean, default: false }, // <-- add isFeatured
    advertiserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ad", adSchema);
