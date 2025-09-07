const { from } = require("form-data");
const cartModel = require("../models/cartModel");
const axios = require("axios");
const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const InvoiceModel = require("../models/invoiceModel");
const InvoiceProductModel = require("../models/invoiceProductModel");

const createInvoice = async (req, res) => {
    const userId = req.headers.id;
    const email = req.headers.email;

    try {
        const matchStage = {
            $match: {
                userId: new mongoose.Types.ObjectId(userId)  // ✅ userId দিয়ে match
            }
        };

        // Example pipeline: cart data + product info
        const joinStage = {
            $lookup: {
                from: "products",               // products collection
                localField: "productId",        // cartModel এ থাকা field
                foreignField: "_id",            // productModel এর field
                as: "product"
            }
        };

        const unwindStage = { $unwind: "$product" };

        const projectStage = {
            $project: {
                _id: 1,
                userId: 1,
                quantity: 1,
                size: 1,
                quentity: 1,
                color: 1,
                productId: 1,
                "product.product_name": 1,
                "product.price": 1,
                "product.discount_price": 1,

            }
        };

        const cartData = await cartModel.aggregate([
            matchStage,
            joinStage,
            unwindStage,
            projectStage
        ]);

        let totalPrice = 0
        let price;
        cartData.forEach((item) => {

            discountPrice = item.product.discount_price;
            if (discountPrice) {
                price = parseFloat(discountPrice * item.quentity)
            } else {
                price = parseFloat(item.product.price * item?.quentity)
            }
        })

        totalPrice = price + price * 0.05



        // =============Step 02: Prepare  Customer Details & Shipping Details=====================================================================================


        const userMatch = {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)  // ✅ userId দিয়ে match
            }
        };
        let Profile = await userModel.aggregate([userMatch]);
        let cus_details = `Name:${Profile[0]['cus_name']}, Email:${email}, Address:${Profile[0]['cus_add']}, Phone:${Profile[0]['cus_phone']}`;
        let ship_details = `Name:${Profile[0]['ship_name']}, City:${Profile[0]['ship_city']}, Address:${Profile[0]['ship_add']}, Phone:${Profile[0]['ship_phone']}`;

        // =============Step 03: Transaction & Other's ID=====================================================================================

        let tran_id = Math.floor(10000000 + Math.random() * 90000000);
        let val_id = 0;
        let delivery_status = "pending"
        let payment_status = "pending"

        // =============Step 04: Create Invoice=====================================================================================

        let createInvoice = await InvoiceModel.create({
            userID: userId,
            payable: price,
            cus_details: cus_details,
            ship_details: ship_details,
            tran_id: tran_id,
            val_id: val_id,
            payment_status: payment_status,
            delivery_status: delivery_status,
            total: totalPrice,
            vat: price * 0.05,
        })


        // =============Step 05: Create Invoice Product=====================================================================================
        let invoice_id = createInvoice['_id'];

        cartData.forEach(async (element) => {
            console.log("element", element)
            await InvoiceProductModel.create({
                userID: userId,
                productID: element['productId'],
                invoiceID: invoice_id,
                qty: element['quentity'],
                price: element.product.discount_price ? element.product.discount_price : element.product.price,
                color: element['color'],
                size: element['size']
            });
        });



        //=============Step 06: Remove Carts=====================================================================================
        await  cartModel.deleteMany({userId:userId});







        res.status(200).json({
            message: "Invoice created successfully",
            email,
            cartData
            // totalPrice
            // invoice: invoiceRes.data   // যদি payment gateway integrate করো
        });
    } catch (error) {
        console.error("❌ Invoice creation error:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createInvoice
};
