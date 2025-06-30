const Razorpay = require("razorpay");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.SECRET_KEY,
});

const create_order = async (req, res) => {
  const { amount, currency, receipt } = req.body;
  // Ensure receipt is no more than 40 characters
  const safeReceipt = receipt && receipt.length > 40 ? receipt.slice(0, 40) : receipt;

  const options = {
    amount: amount * 100,
    currency: currency,
    receipt: safeReceipt,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verify_order = async (req, res) => {
  const crypto = require("crypto");
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const secret = process.env.SECRET_KEY;

  const hash = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");
  console.log(hash, razorpay_signature);
  if (hash === razorpay_signature) {
    res.json({ status: "success" });
  } else {
    res.status(400).json({ status: "failure" });
  }
};
module.exports = { create_order, verify_order };
