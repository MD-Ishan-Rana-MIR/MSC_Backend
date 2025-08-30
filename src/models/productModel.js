const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const productSchema = new Schema({
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",   // 👉 foreign key (reference to Category model)
        required: true
    },
    brand_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brands",      // 👉 foreign key (reference to Brand model)
        required: true
    },
    product_name: {
        type: String,
        required: true
    },
    product_type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount_price: {
        type: Number,
        required: true
    },
    product_color: [
        {
            name: { type: String, required: true },   // যেমন "Red"
            code: { type: String }                    // যেমন "#FF0000"
        }
    ],
    product_image: {
        type: [String],
        required: true
    },
    grunte: {
        type: String
    },
    in_stock: {
        type: Boolean
    },
    product_description: {
        type: String
    }
}, { timestamps: true, versionKey: false });

const productModel = model("products",productSchema);

module.exports = productModel