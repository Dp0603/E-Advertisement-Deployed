const booking = require("../models/bookingModel");
const ads = require("../models/adsModel");

const createBooking = async (req, res) => {
  try {
    const {
      startTime,
      endTime,
      displayFrequency,
      specialPlacement,
      contactPerson,
      specialInstructions,
      analyticsRequired,
      payment,
    } = req.body;
    const adId = req.params.adId;

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (startDate >= endDate) {
      return res
        .status(400)
        .json({ message: "startTime must be before endTime" });
    }

    if (startDate < new Date()) {
      return res
        .status(400)
        .json({ message: "startTime must be in the future" });
    }
    const newBookings = new booking({
      clientId: req.user.id,
      adId,
      startTime: startDate,
      endTime: endDate,
      displayFrequency: displayFrequency || "standard",
      specialPlacement,
      contactPerson,
      specialInstructions,
      analyticsRequired: analyticsRequired || false,
      payment: {
        orderId: payment.orderId,
        paymentId: payment.paymentId,
        signature: payment.signature,
        amount: payment.amount || 0,
        currency: payment.currency || "INR",
        paymentDate: new Date(),
      },
    });
    await newBookings.save();
    const fullBooking = await booking
      .findById(newBookings._id)
      .populate("adId");
    res.status(200).json({ message: "Booking done", fullBooking });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBookings = async (req, res) => {
  try {
    const allBookings = await booking
      .find()
      .select(
        "startTime endTime displayFrequency specialPlacement contactPerson specialInstructions analyticsRequired status"
      )
      .populate({
        path: "adId",
        select: "title description budget",
        populate: [
          {
            path: "stateId",
            select: "name",
          },
          {
            path: "cityId",
            select: "name",
          },
        ],
      })
      .populate({
        path: "clientId",
        select: "firstName email",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Bookings fetched", data: allBookings });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBookingsByUser = async (req, res) => {
  try {
    const userId = req.user.id; // Provided by verifyToken middleware

    const userBookings = await booking
      .find({ clientId: userId })
      .select(
        "startTime endTime displayFrequency specialPlacement contactPerson specialInstructions analyticsRequired status"
      )
      .populate({
        path: "adId",
        select: "title description budget",
        populate: [
          { path: "stateId", select: "name" },
          { path: "cityId", select: "name" },
        ],
      })
      .populate({
        path: "clientId",
        select: "firstName email",
      })
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({
        message: "Your bookings fetched successfully",
        data: userBookings,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!["rejected", "confirmed"].includes(status)) {
    return res.status(400).json({ message: "Invalid values for status" });
  }
  try {
    const updatedBooking = await booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: "Ad not found" });
    }
    res
      .status(200)
      .json({ message: "Booking status updated", data: updatedBooking });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createBooking, getBookings, updateBookingStatus , getBookingsByUser };
