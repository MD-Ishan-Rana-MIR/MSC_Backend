const mongoose = require("mongoose");

const { Schema, model } = mongoose;


const productSliderSchema = new Schema({
    ocation: {
        type: String,
    },
    productName: {
        type: String
    },
    des: {
        type: String,
    },
    productImage: {
        type: String
    }
}, { timestamps: true, versionKey: false });

const productSliderModel = model("ProductSliders",productSliderSchema);


module.exports = productSliderModel