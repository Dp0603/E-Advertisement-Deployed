require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/userModel");
const mailMiddleware = require("../middleware/mailMiddleware");

// const router = express.Router();
const secretKey = process.env.JWT_SECRET;

const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
const isValidPassword = (password) => /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/.test(password);


const registerAdvertiser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role = "advertiser" } = req.body;
        if (firstName.length < 3) return res.status(400).json({ message: "FirstName should be at least 3 characters long!" });
        if (lastName.length < 3) return res.status(400).json({ message: "LastName should be at least 3 characters long!" });
        if (!isValidEmail(email)) return res.status(400).json({ message: "Invalid email format" });
        if (!isValidPassword(password)) return res.status(400).json({ message: "password should contain atleast 1 lowercase, 1 uppercase, 1 digit, and 1 special character" });

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
            role
        });
        await newUser.save();

        await mailMiddleware.sendingMail(newUser.email, "Welcome to Adverse", "We Wish You a Warm Welcome");
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
                role: existingAdvertiser.role
            },
            secretKey,
            { expiresIn: '1y' }
        );
        console.log("Token:", token);
        res.status(200).json({ message: "Login succesfull", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

const updateAdvertiserProfile = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;
    try {

        const updateDetails = await user.findByIdAndUpdate(id, { firstName, lastName, email }, { new: true });
        if (!updateDetails) {
            res.status(404).json({ message: "Advertiser not found" });
        }
        res.status(200).json({ message: "Details updated succesfully", data: updateDetails })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server error" });
    }

}

const updateAdvertiserPassword = async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    try {
        const existingAdvertiser = await user.findById(id);
        if (!existingAdvertiser) return res.status(404).json({ message: "Not found" })

        const isMatch = await bcrypt.compare(oldPassword, existingAdvertiser.password);
        if (!isMatch) return res.status(404).json({ message: "Current password is wrong" });
        if (confirmPassword !== newPassword) {
            return res.status(400).json({ message: "Incorrect password" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatePassword = await user.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

        res.status(200).json({ message: "Password updated", data: updatePassword });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}



module.exports = { registerAdvertiser, loginAdvertiser, updateAdvertiserProfile, updateAdvertiserPassword };