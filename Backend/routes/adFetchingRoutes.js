const express = require("express");
const router = express.Router();
const { verifyToken, authorizedRoles } = require("../middleware/authMiddleware");
const { getAdsByCityId, getallAds, getAdsByAdvertiserId, getParticularAdById } = require("../controllers/fetchAds");


router.get("/ads/:id", verifyToken, authorizedRoles("viewer", "advertiser"), getAdsByAdvertiserId); 
router.get("/ads/city/:cityId", verifyToken, authorizedRoles("advertiser", "viewer"), getAdsByCityId);
router.get("/browseads", verifyToken, authorizedRoles("viewer"), getallAds);
router.get("/ad/:id", getParticularAdById);
router.get("/ads", verifyToken, authorizedRoles("viewer"), getallAds);
// router.get("/ads/area/:areaId", verifyToken, authorizedRoles("advertiser"), getAdsbyAreaId)
module.exports = router;