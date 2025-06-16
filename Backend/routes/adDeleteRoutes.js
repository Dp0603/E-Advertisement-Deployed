const express = require("express");
const router = express.Router();
const { deleteAd } = require("../controllers/deleteAds");
const { verifyToken, authorizedRoles } = require("../middleware/authMiddleware");


router.delete("/ads/:id", verifyToken, authorizedRoles("advertiser", "admin"), deleteAd);

module.exports = router;
