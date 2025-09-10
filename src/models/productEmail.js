// {
//     "product_name": "iPhone 15 Pro",
//     "product_img": "https://example.com/iphone15.jpg",
//     "description": "The most powerful iPhone ever with A17 Pro chip.",
//     "discount_price": "999",
//     "price" : 2000
// }

const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productEmailSchema = new Schema({
    product_name: {
        type: String
    },
    product_img: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number,

    },
    discount_price : {
        type : Number
    }
}, { timestamps: true, versionKey: false });

const producttEmailModel = model("product-email", productEmailSchema);


module.exports = producttEmailModel;