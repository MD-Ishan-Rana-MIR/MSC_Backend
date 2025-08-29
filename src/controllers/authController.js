const userModel = require("../models/userModel");
const { errorResponse, successResponse } = require("../utility/response");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utility/token");
require("dotenv").config();



const userRegistration = async (req, res) => {
    const { email, password, confirm_password, full_name } = req.body;

    try {
        // Check if email exists
        const existsEmail = await userModel.findOne({ email });
        if (existsEmail) {
            return errorResponse(res, 409, "User email already exists", null);
        }

        // Check if passwords match
        if (password !== confirm_password) {
            return errorResponse(res, 400, "User password does not match", null);
        }

        // Hash only the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save only one hashed password
        const newUser = await userModel.create({
            full_name,
            email,
            password: hashedPassword
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
    const { full_name } = req.body;
    const id = req.headers.id;

    const filter = { _id: id };
    const update = { full_name }; // fields to update

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


module.exports = {
    userRegistration,
    userLogin,
    userProfile,
    userProfileUpdate
}