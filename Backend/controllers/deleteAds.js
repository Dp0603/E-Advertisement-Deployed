const ad = require("../models/adsModel");

const deleteAd = async (req, res) => {
    const { id } = req.params;
    try {
        const ads = await ad.findByIdAndDelete(id);
        console.log(id);
        return res.status(200).json({ message: "ad deleted", ads });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Ad deleted" });
    }

}

module.exports = { deleteAd };