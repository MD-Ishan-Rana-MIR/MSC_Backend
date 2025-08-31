const mongoose = require("mongoose");


const { Schema, model } = mongoose;



const wishSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
    }
}, { timestamps: true, versionKey: false });

const wishModel = model("wish", wishSchema );


module.exports = wishModel;