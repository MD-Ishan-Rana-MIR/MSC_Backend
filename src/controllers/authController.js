const SendEmailUtility = require("../utility/email");


const userModel = require("../models/userModel");
const { errorResponse, successResponse } = require("../utility/response");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utility/token");
const otpModel = require("../models/otpModel");
require("dotenv").config();


const userRegistration = async (req, res) => {
    try {
        const { email, password, confirm_password, full_name, avatar } = req.body;

        // Check if email exists
        const existsEmail = await userModel.findOne({ email });
        if (existsEmail) {
            return errorResponse(res, 409, "User email already exists", null);
        }

        // Check if passwords match
        if (password !== confirm_password) {
            return errorResponse(res, 400, "User password does not match", null);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user (exclude confirm_password)
        const newUser = await userModel.create({
            full_name,
            email,
            password: hashedPassword,
            avatar: avatar || "https://res.cloudinary.com/demo/image/upload/default-avatar.png"
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: newUser._id,
                full_name: newUser.full_name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error(error);
        return errorResponse(res, 500, "Server error", error.message);
    }
};


const userLogin = async (req, res) => {
    const { email, password, confirm_password } = req.body;

    try {

        // Check if passwords match
        if (password !== confirm_password) {
            return errorResponse(res, 400, "User password does not match", null);
        }

        // check if user exists
        const user = await userModel.findOne({ email });

        if (!user) {
            return errorResponse(res, 404, "User not found", null);
        }



        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return errorResponse(res, 401, "Invalid credentials", null);
        }



        const token = generateToken({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, "24h")

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: {
                id: user._id,
                full_name: user.full_name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        return errorResponse(res, 500, "Server error", error.message);
    }
};


const userProfile = async (req, res) => {
    const id = req.headers.id;

    try {
        const filter = { _id: id };

        // Await and fix select
        const userProfile = await userModel.findOne(filter).select("full_name email");

        if (!userProfile) {
            return errorResponse(res, 404, "User not found", null);
        }

        successResponse(res, 200, "User profile retrieved successfully", userProfile);

    } catch (error) {
        errorResponse(res, 500, "Something went wrong", error.message);
    }
};


const userProfileUpdate = async (req, res) => {
    const reqBody = req.body;
    const id = req.headers.id;

    const filter = { _id: id };
    const update = { $set: reqBody }; // ✅ $set ব্যবহার করে direct fields update

    try {
        const result = await userModel.updateOne(filter, update);

        if (result.matchedCount === 0) {
            return errorResponse(res, 404, "User not found", null);
        }

        successResponse(res, 200, "User profile updated successfully", null);

    } catch (error) {
        console.error(error);
        errorResponse(res, 500, "Something went wrong", error.message);
    }
};

// forget password 


const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email)

        if (!email) {
            return res.status(400).json({ status: "fail", msg: "Email are required" });
        }

        const isExistEmail = await userModel.findOne({ email });
        if (!isExistEmail) {
            return res.status(404).json({ status: "fail", msg: "Email not found" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Send OTP email
        await SendEmailUtility(email, "6 Digit otp code is", otp);

        // Store OTP in DB (upsert: if email exists, replace OTP)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
        const data = await otpModel.findOneAndUpdate(
            { email },
            { otp, expiresAt, createdAt: new Date() },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            status: "success",
            msg: "OTP sent successfully",
            data: data
        });
    } catch (error) {
        console.error("Send OTP error:", error);
        return res.status(500).json({ status: "error", msg: "Failed to send OTP" });
    }
};


const userOtpVerify = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ status: "fail", msg: "Email and OTP are required" });
        }

        // Find OTP record
        const record = await otpModel.findOne({ email });
        if (!record) {
            return res.status(404).json({ status: "fail", msg: "Email not found." });
        }

        // Check OTP match (convert both to string for safety)
        if (String(record.otp) !== String(otp)) {
            return res.status(400).json({ status: "fail", msg: "Invalid OTP" });
        }

        // Verify OTP (update status)
        const filter = { otp: otp, email: email, status: 0 };
        const otpVerify = await otpModel.updateOne(filter, { $set: { status: 1 } });

        // If no document updated (means already verified before)
        if (otpVerify.modifiedCount === 0) {
            return res.status(400).json({ status: "fail", msg: "OTP already verified or invalid." });
        }

        return res.status(200).json({
            status: "success",
            msg: "OTP verified successfully"
        });

    } catch (error) {
        console.error("OTP verification error:", error);
        return res.status(500).json({ status: "error", msg: "Failed to verify OTP" });
    }
};


const passwordReset = async (req, res) => {
    try {
        const { password, email } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: "fail", msg: "Password are required" });
        }

        // Find verified OTP record
        const otpData = await otpModel.findOne({ email, status: 1 });
        if (!otpData) {
            return res.status(400).json({ status: "fail", msg: "OTP not verified or expired" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        await userModel.updateOne(
            { email },
            { password: hashedPassword }
        );

        // Mark OTP as used (optional)
        await otpModel.deleteOne({ email });

        return res.status(200).json({
            status: "success",
            msg: "Password reset successful"
        });

    } catch (error) {
        console.error("Password reset error:", error);
        return res.status(500).json({ status: "error", msg: "Failed to reset password" });
    }
};



module.exports = {
    userRegistration,
    userLogin,
    userProfile,
    userProfileUpdate,
    sendOtp,
    userOtpVerify,
    passwordReset
}