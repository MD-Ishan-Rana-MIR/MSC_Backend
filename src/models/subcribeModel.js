const mongoose = require("mongoose");


const { Schema, model } = mongoose;


const subcribeSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    }
}, { timestamps: true, versionKey: false });


const subcribeModel = model("subscribe", subcribeSchema);


module.exports = subcribeModel;