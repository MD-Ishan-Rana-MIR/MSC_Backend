const producttEmailModel = require("../models/productEmail");
const subcribeModel = require("../models/subcribeModel");
const productEmail = require("../utility/productEmail");
const { successResponse, errorResponse } = require("../utility/response");
const userSubcribe = async (req, res) => {
    const { email } = req.body;
    try {
        const existsEmail = await subcribeModel.findOne({ email });
        if (existsEmail) {
            return errorResponse(res, 400, "This email is already subscribed");
        }

        const data = await subcribeModel.create({ email });
        return successResponse(res, 201, "Subscribed successfully", data);
    } catch (error) {
        return errorResponse(res, 500, "Something went wrong", error.message);
    }
};


const userSendEmail = async (req, res) => {
    try {
        const { product_name, product_img, description, discount_price, price } = req.body;
        const subscribers = await subcribeModel.find({});
        const emails = subscribers.map(sub => sub.email);

        if (emails.length === 0) {
            return res.status(404).json({ message: "No subscribers found" });
        }

        await producttEmailModel.create({ product_name, product_img, description, discount_price, price });

        // send email to all subscribers
        await productEmail(
            emails,
            `🔥 New Offer on ${product_name}`,
            { product_name, product_img, description, discount_price, price }
        );

        res.status(201).json({ message: "Newsletter sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send newsletter", error });
    }
};

const allSubcriber = async (req, res) => {
    try {

        const data = await subcribeModel.find().sort({createdAt:-1});
        if(data.length===0){
            errorResponse(res,404,"Subcriber not found",null);
        }

        successResponse(res,200,"Subcriber retrive successfully",data)

    } catch (error) {

        errorResponse(res,500,"Something went wrong",error)

    }
}






module.exports = {
    userSubcribe,
    userSendEmail,
    allSubcriber
}