const express = require("express");
const router = express.Router();
const { verifyToken, authorizedRoles } = require("../middleware/authMiddleware");
const { saveAd, getSavedAds, removeSavedAd } = require("../controllers/savedAdController");

router.post("/save-ad", verifyToken, authorizedRoles("viewer"), saveAd);
router.get("/saved-ads", verifyToken, authorizedRoles("viewer"), getSavedAds);
router.delete("/remove-ad/:adId", verifyToken, authorizedRoles("viewer"), removeSavedAd);

module.exports = router;
