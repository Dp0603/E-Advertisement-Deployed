require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/userModel");
const mailMiddleware = require("../middleware/mailMiddleware");

const secretKey = process.env.JWT_SECRET;

const isValidEmail = (email) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
const isValidPassword = (password) =>
  /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/.test(password);

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role = "viewer" } = req.body;
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
      return res
        .status(400)
        .json({
          message:
            "password should contain atleast 1 lowercase, 1 uppercase, 1 digit, and 1 special character",
        });

    const existingUser = await user.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists!" });

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
    await mailMiddleware.sendingMail(
      newUser.email,
      "Welcome to Adverse",
      `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f9fc; padding: 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(33,203,243,0.08);">
                <tr>
                  <td style="padding: 32px 40px 16px 40px; text-align: center;">
                    <img src="https://i.imgur.com/8Km9tLL.png" alt="Adverse Logo" width="80" style="margin-bottom: 16px;" />
                    <h2 style="color: #1976d2; margin-bottom: 8px;">Welcome to Adverse, ${
                      newUser.firstName
                    }!</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 40px 24px 40px; color: #333;">
                    <p style="font-size: 18px; margin-bottom: 16px;">
                      We're excited to have you join our platform.
                    </p>
                    <p style="font-size: 16px; margin-bottom: 16px;">
                      Your account has been created successfully. You can now log in and start exploring advertising opportunities, manage your profile, and connect with our vibrant community.
                    </p>
                    <p style="font-size: 16px; margin-bottom: 24px;">
                      If you have any questions or need assistance, our support team is here to help you at any time.
                    </p>
                    <a href="https://your-app-url.com/login" style="display: inline-block; padding: 12px 32px; background: linear-gradient(90deg, #1976d2 60%, #21cbf3 100%); color: #fff; border-radius: 5px; text-decoration: none; font-weight: 600; font-size: 16px;">
                      Login to your account
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 40px 32px 40px; color: #888; font-size: 14px; text-align: center;">
                    <hr style="border: none; border-top: 1px solid #eee; margin-bottom: 16px;" />
                    Thank you for choosing <span style="color: #1976d2; font-weight: bold;">Adverse</span>.<br/>
                    <span style="font-size: 13px;">&copy; ${new Date().getFullYear()} Adverse. All rights reserved.</span>
                  </td>
                </tr>
              </table>
            </div>
            `
    );
    res.status(201).json({ message: "User registered succesfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found!" });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }
    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      secretKey,
      { expiresIn: "1y" }
    );

    res.status(200).json({
      message: "Login succesfull",
      token,
      user: {
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUsersById = async (req, res) => {
  const { id } = req.params;
  try {
    const particularUser = await user.findById(id);
    if (!particularUser) {
      res.status(404).json({ message: "Not found" });
    }
    res
      .status(200)
      .json({ message: "User fetched succesfully", data: particularUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateuserProfile = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;
  try {
    const updateDetails = await user.findByIdAndUpdate(
      id,
      { firstName, lastName, email },
      { new: true }
    );
    if (!updateDetails) {
      res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "Details updated succesfully", data: updateDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const updateuserPassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    const existingUser = await user.findById(id);
    if (!existingUser) return res.status(404).json({ message: "Not found" });

    const isMatch = await bcrypt.compare(oldPassword, existingUser.password);
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Create a reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // You can use your frontend URL here
    const resetLink = `https://your-frontend-url/reset-password/${resetToken}`;

    // Send email
    await mailMiddleware.sendingMail(
      existingUser.email,
      "Password Reset",
      `Click the link to reset your password: ${resetLink}`
    );

    res.status(200).json({ message: "Reset link sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(password, 10);
    await user.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsersById,
  updateuserProfile,
  updateuserPassword,
  forgotPassword,
  resetPassword,
};
