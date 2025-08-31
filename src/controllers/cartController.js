const cartModel = require("../models/cartModel");
const { successResponse, errorResponse } = require("../utility/response");


const addToCart = async (req, res) => {
    const userId = req.headers.id;
    const { productId, quentity } = req.body;

    try {
        let cartItem = await cartModel.findOne({ productId });

        if (cartItem) {
            return res.status(400).json({
                status: "fail",
                msg: "Cart item already exists"
            })
        }

        const cartData = await cartModel.create({ userId, productId, quentity });
        successResponse(res, 201, "Product added to cart successfully", cartData);

    } catch (error) {
        console.error(error);
        errorResponse(res, 500, "Something went wrong", error);
    }
};

const cartList = async (req, res) => {
    try {
        const joinWithProductId = {
            $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "product"
            }
        };

        const unwindProduct = { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } };

        const joinWithUserId = {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        };


        const unWindUser = { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } };



        const cartData = await cartModel.aggregate([
            joinWithProductId,
            joinWithUserId,
            unwindProduct,
            unWindUser
        ]);


        if (cartData.length === 0) {
            return res.status(404).json({
                status: "fail",
                msg: "Cart list not found"
            })
        }


        successResponse(res, 200, "Cart list find successfully", cartData);







    } catch (error) {
        errorResponse(res, 500, "Something went worng", error);

    }
}

module.exports = {
    addToCart,
    cartList
}