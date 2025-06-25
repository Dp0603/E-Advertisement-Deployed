const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  verifyToken,
  authorizedRoles,
} = require("../middleware/authMiddleware");

const {
  createAds,
  createAdsWithFile,
  updateAds,
  updateAdsWithFile,
} = require("../controllers/adCreationController");

// ✅ Multer configuration
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

// ▶️ Create ad (no image)
router.post(
  "/advertiser/createads",
  verifyToken,
  authorizedRoles("advertiser"),
  createAds
);

// ▶️ Create ad (with image)
router.post(
  "/advertiser/createadswithfile",
  verifyToken,
  authorizedRoles("advertiser"),
  upload.single("image"), // multer processes 'image' field
  createAdsWithFile
);

// ▶️ Update ad (no image)
router.put(
  "/advertiser/updateads/:id",
  verifyToken,
  authorizedRoles("advertiser", "viewer"),
  updateAds
);

// ▶️ Update ad (with image)
router.put(
  "/advertiser/updateadswithfile/:id",
  verifyToken,
  authorizedRoles("advertiser"),
  upload.single("image"),
  updateAdsWithFile
);

module.exports = router;
