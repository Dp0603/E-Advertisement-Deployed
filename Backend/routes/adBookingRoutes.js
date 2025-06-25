const express = require("express");
const router = express.Router();
const { createBooking, getBookings, updateBookingStatus , getBookingsByUser } = require("../controllers/bookingController");
const { verifyToken, authorizedRoles } = require("../middleware/authMiddleware");
const { create_order, verify_order } = require("../controllers/razorPayController");
router.post("/bookads/:adId", verifyToken, authorizedRoles("viewer"), createBooking)
router.get("/getbookings", verifyToken, authorizedRoles("viewer", "advertiser"), getBookings)
router.get("/getbookingsbyuser", verifyToken, authorizedRoles("viewer"), getBookingsByUser); // This route is for users to get their own bookings
router.put("/updatebookingstatus/:id", verifyToken, authorizedRoles("advertiser"), updateBookingStatus);
router.post("/createorder", verifyToken, authorizedRoles("viewer"), create_order);
router.post("/verifyorder", verifyToken, authorizedRoles("viewer"), verify_order)

module.exports = router;