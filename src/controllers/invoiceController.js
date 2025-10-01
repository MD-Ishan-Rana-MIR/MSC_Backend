const { from } = require("form-data");
const cartModel = require("../models/cartModel");
const axios = require("axios");
const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const InvoiceModel = require("../models/invoiceModel");
const InvoiceProductModel = require("../models/invoiceProductModel");
const PaymentSettingModel = require("../models/PamentSettingModel");
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
        await cartModel.deleteMany({ userId: userId });



        const paymentSetting = await PaymentSettingModel.find();
        console.log(paymentSetting[0]["store_id"])


        const formData = new FormData();


        formData.append("store_id", paymentSetting[0]["store_id"]);
        formData.append("store_passwd", paymentSetting[0]["store_passwd"]);
        formData.append("total_amount", totalPrice.toString());
        formData.append("currency", paymentSetting[0]["currency"]);
        formData.append("tran_id", tran_id);
        formData.append("product_category", "e-commerce");
        formData.append("success_url", `${paymentSetting}[0]["success_url"]/${tran_id}`);
        formData.append("fail_url", `${paymentSetting}[0]["fail_url"]/${tran_id}`);
        formData.append("cancel_url", `${paymentSetting}[0]["cancel_url"]/${tran_id}`);
        formData.append("ipn_url", `${paymentSetting}[0]["ipn_url"]/${tran_id}`);

        // Customer Information

        formData.append("cus_name", `${Profile[0]['cus_name']}`);
        formData.append("cus_email", `${email}`);
        formData.append("cus_add1", `${Profile[0]['cus_add']}`);
        formData.append("cus_add2", `${Profile[0]['cus_add']}`);
        formData.append("cus_city", `${Profile[0]['cus_city']}`);
        formData.append("cus_postcode", `${Profile[0]['cus_postcode']}`);
        formData.append("cus_country", `${Profile[0]['cus_country']}`);
        formData.append("cus_phone", `${Profile[0]['cus_phone']}`);


        // let cus_details = `Name:${Profile[0]['cus_name']}, Email:${email}, Address:${Profile[0]['cus_add']}, Phone:${Profile[0]['cus_phone']}`;
        // let ship_details = `Name:${Profile[0]['ship_name']}, City:${Profile[0]['ship_city']}, Address:${Profile[0]['ship_add']}, Phone:${Profile[0]['ship_phone']}`;


        // Shipment Information

        formData.append("shipping_method", `yes`);

        formData.append("ship_name", `${Profile[0]['ship_name']}`);
        formData.append("ship_add1", `${Profile[0]['ship_add']}`);
        formData.append("ship_add2", `${Profile[0]['ship_add']}`);
        formData.append("ship_area", `${Profile[0]['ship_add']}`);
        formData.append("ship_city", `${Profile[0]['ship_city']}`);
        formData.append("ship_postcode", `${Profile[0]['ship_postcode']}`);
        formData.append("ship_state", `${Profile[0]['ship_state']}`);
        formData.append("ship_country", `${Profile[0]['ship_country']}`);


        formData.append("product_name", `mern shop`);
        formData.append("product_category", `mern shop product category `);
        formData.append("product_profile", `mern shop product profile `);
        formData.append("product_amount", `Accroding to invoice `);


        const sslRes = await axios.post(paymentSetting[0]["init_url"]);








        res.status(200).json({
            status: "success",
            data: sslRes.data

        });
    } catch (error) {
        console.error("❌ Invoice creation error:", error);
        res.status(500).json({ error: error.message });
    }
};


const paymentSuccess = async (req, res) => {
    const tran_id = req.params.tran_id;
    try {

        InvoiceModel.updateOne({ tran_id: tran_id }, { payment_status: "success" });
        return {
            status: "success"
        }

    } catch (error) {
        console.error("❌ Invoice creation error:", error);
        res.status(500).json({ error: error.message });
    }
};


const paymentFail = async (req, res) => {
    const tran_id = req.params.tran_id;
    try {

        InvoiceModel.updateOne({ tran_id: tran_id }, { payment_status: "fail" });
        return {
            status: "success"
        }

    } catch (error) {
        console.error("❌ Invoice creation error:", error);
        res.status(500).json({ error: error.message });
    }
};


const paymentCancel = async (req, res) => {
    const tran_id = req.params.tran_id;
    try {

        InvoiceModel.updateOne({ tran_id: tran_id }, { payment_status: "cancel" });
        return {
            status: "success"
        }

    } catch (error) {
        console.error("❌ Invoice creation error:", error);
        res.status(500).json({ error: error.message });
    }
}


const paymentIpn = async (req,res)=>{
        const tran_id = req.params.tran_id;
        const status = req.body.status;
    try {

        InvoiceModel.updateOne({ tran_id: tran_id }, { payment_status: status });
        return {
            status: "success"
        }

    } catch (error) {
        console.error("❌ Invoice creation error:", error);
        res.status(500).json({ error: error.message });
    }
}














module.exports = {
    createInvoice,
    paymentSuccess,
    paymentFail,
    paymentCancel,
    paymentIpn
};
