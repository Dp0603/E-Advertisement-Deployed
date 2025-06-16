const express = require("express");
const router = express.Router();
const { verifyToken, authorizedRoles } = require("../middleware/authMiddleware");
const { createAds, createAdsWithFile, updateAds, updateAdsWithFile } = require("../controllers/adCreationController");


router.post("/advertiser/createads", verifyToken, authorizedRoles("advertiser"), createAds);
router.post("/advertiser/createadswithfile", verifyToken, authorizedRoles("advertiser"), createAdsWithFile);
router.put("/advertiser/updateads/:id", verifyToken, authorizedRoles("advertiser", "viewer"), updateAds);
router.put("/advertiser/updateadswithfile/:id", verifyToken, authorizedRoles("advertiser"), updateAdsWithFile);

module.exports = router;