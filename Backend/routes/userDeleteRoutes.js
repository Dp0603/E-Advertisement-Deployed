const express = require("express");
const router = express.Router();
const { verifyToken, authorizedRoles } = require("../middleware/authMiddleware");
const { deleteUser } = require("../controllers/adminController");

router.delete("/delete/user/:id", verifyToken, authorizedRoles("admin"), deleteUser);

module.exports = router;