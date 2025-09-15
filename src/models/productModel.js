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
    },
    product_color: [
        {
            type : String
        }
    ],
    product_image_1: {
        type: String,
        required: true
    },
    product_image_2: {
        type: String,
        required: true
    },
    product_image_3: {
        type: String,
        required: true
    },
    product_image_4: {
        type: String,
        required: true
    },
    grunte: {
        type: String
    },
    in_stock: {
        type: Boolean
    },
    
    size : [
       {
         type : String,
        required : true
       }
    ],
    product_des : {
        type : String
    }
    
}, { timestamps: true, versionKey: false });

const productModel = model("products",productSchema);

module.exports = productModel