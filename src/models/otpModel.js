const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const otpSchema = new Schema({
    email: {
        type: String
    },
    otp: {
        type: String
    },
    status: {
        type: Number,
        default: 0
    }
}, { timestamps: true, versionKey: false });

const otpModel = model("otpModel", otpSchema);

module.exports = otpModel;