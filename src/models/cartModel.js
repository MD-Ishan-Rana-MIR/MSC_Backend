const mongoose = require("mongoose");

const { Schema, model } = mongoose;


const cartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
    },
    quentity: {
        type: Number,
        required: true
    },
    size : {
        type : String,
        required : true
    },
    color : {
        type : String,
        required : true
    }
}, { timestamps: true, versionKey: false });


const cartModel = model("cart", cartSchema);

module.exports = cartModel