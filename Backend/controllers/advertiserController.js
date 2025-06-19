require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/userModel");
const mailMiddleware = require("../middleware/mailMiddleware");

// const router = express.Router();
const secretKey = process.env.JWT_SECRET;

const isValidEmail = (email) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
const isValidPassword = (password) =>
  /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/.test(password);

const registerAdvertiser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role = "advertiser",
    } = req.body;
    if (firstName.length < 3)
      return res
        .status(400)
        .json({ message: "FirstName should be at least 3 characters long!" });
    if (lastName.length < 3)
      return res
        .status(400)
        .json({ message: "LastName should be at least 3 characters long!" });
    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email format" });
    if (!isValidPassword(password))
      return res.status(400).json({
        message:
          "password should contain atleast 1 lowercase, 1 uppercase, 1 digit, and 1 special character",
      });

    const existingUser = await user.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "advertiser already exists!" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new user({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    // Professional Welcome Email
    const emailSubject =
      "🎉 Welcome to Adverse - Your Advertising Journey Begins!";
    const emailBody = `
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f6f9fc;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: #fff;
              border-radius: 10px;
              box-shadow: 0 2px 8px rgba(33,203,243,0.08);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(90deg, #1976d2 60%, #21cbf3 100%);
              color: #fff;
              padding: 32px 40px 16px 40px;
              text-align: center;
            }
            .header img {
              width: 80px;
              margin-bottom: 16px;
            }
            .content {
              padding: 0 40px 24px 40px;
              color: #333;
            }
            .content p {
              font-size: 16px;
              margin-bottom: 16px;
            }
            .cta-btn {
              display: inline-block;
              padding: 12px 32px;
              background: linear-gradient(90deg, #1976d2 60%, #21cbf3 100%);
              color: #fff;
              border-radius: 5px;
              text-decoration: none;
              font-weight: 600;
              font-size: 16px;
              margin-top: 16px;
            }
            .footer {
              padding: 24px 40px 32px 40px;
              color: #888;
              font-size: 14px;
              text-align: center;
            }
            .footer hr {
              border: none;
              border-top: 1px solid #eee;
              margin-bottom: 16px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://i.imgur.com/8Km9tLL.png" alt="Adverse Logo" />
              <h2>Welcome to Adverse, ${firstName}!</h2>
            </div>
            <div class="content">
              <p>We're excited to have you join our platform.</p>
              <p>Your account has been created successfully. You can now log in and start exploring advertising opportunities, manage your profile, and connect with our vibrant community.</p>
              <p>If you have any questions or need assistance, our support team is here to help you at any time.</p>
              <a href="https://your-app-url.com/login" class="cta-btn">Login to your account</a>
            </div>
            <div class="footer">
              <hr />
              Thank you for choosing <span style="color: #1976d2; font-weight: bold;">Adverse</span>.<br/>
              <span style="font-size: 13px;">&copy; ${new Date().getFullYear()} Adverse. All rights reserved.</span>
            </div>
          </div>
        </body>
        </html>
        `;

    await mailMiddleware.sendingMail(newUser.email, emailSubject, emailBody);

    res.status(201).json({ message: "Advertiser registered succesfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const loginAdvertiser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingAdvertiser = await user.findOne({ email });
    console.log("Existing Advertiser:", existingAdvertiser);
    if (!existingAdvertiser) {
      return res.status(400).json({ message: "advertiser not found!" });
    }
    const isMatch = await bcrypt.compare(password, existingAdvertiser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }
    const token = jwt.sign(
      {
        id: existingAdvertiser._id,
        email: existingAdvertiser.email,
        role: existingAdvertiser.role,
      },
      secretKey,
      { expiresIn: "1y" }
    );
    console.log("Token:", token);
    res.status(200).json({ message: "Login succesfull", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateAdvertiserProfile = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;
  try {
    const updateDetails = await user.findByIdAndUpdate(
      id,
      { firstName, lastName, email },
      { new: true }
    );
    if (!updateDetails) {
      res.status(404).json({ message: "Advertiser not found" });
    }
    res
      .status(200)
      .json({ message: "Details updated succesfully", data: updateDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const updateAdvertiserPassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    const existingAdvertiser = await user.findById(id);
    if (!existingAdvertiser)
      return res.status(404).json({ message: "Not found" });

    const isMatch = await bcrypt.compare(
      oldPassword,
      existingAdvertiser.password
    );
    if (!isMatch)
      return res.status(404).json({ message: "Current password is wrong" });
    if (confirmPassword !== newPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatePassword = await user.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json({ message: "Password updated", data: updatePassword });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerAdvertiser,
  loginAdvertiser,
  updateAdvertiserProfile,
  updateAdvertiserPassword,
};
