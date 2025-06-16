const express = require("express");
const router = express.Router();
const { verifyToken, authorizedRoles } = require("../middleware/authMiddleware");
const { getAdDashboard } = require("../controllers/advertiserDashboard");

router.get('/advertiser/dashboard/:id', verifyToken, authorizedRoles("advertiser"), getAdDashboard);

module.exports = router;