const express = require("express");
const { registerUser, loginUser, getUsersById, updateuserProfile, updateuserPassword } = require("../controllers/authController");
const { registerAdvertiser, loginAdvertiser, updateAdvertiserProfile, updateAdvertiserPassword } = require("../controllers/advertiserController")
const { verifyToken, authorizedRoles } = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/register/advertiser", registerAdvertiser);
router.post("/login/advertiser", loginAdvertiser)
router.put("/updateprofile/:id", verifyToken, authorizedRoles("advertiser"), updateAdvertiserProfile);
router.put("/updatepassword/:id", verifyToken, authorizedRoles("advertiser"), updateAdvertiserPassword);
router.get("/advertiser/:id", verifyToken, authorizedRoles("advertiser", "admin"), getUsersById);
router.put("/updateuserprofile/:id", verifyToken, authorizedRoles("viewer"), updateuserProfile);
router.put("/updateuserpassword/:id", verifyToken, authorizedRoles("viewer"), updateuserPassword);
router.get("/user/:id", verifyToken, authorizedRoles("viewer"), getUsersById);
module.exports = router;
