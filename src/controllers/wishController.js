const { default: mongoose } = require("mongoose");
const wishModel = require("../models/wishModel");
const { successResponse, errorResponse } = require("../utility/response");

const addWish = async (req, res) => {
    const userId = req.headers.id;
    const productId = req.body.productId;
    const paylaod = {
        userId: userId,
        productId: productId
    }
    try {
        if (!productId) {
            return res.status(400).json({
                status: "fail",
                message: "Product not found"
            })
        }
        const wishData = await wishModel.create(paylaod);
        return successResponse(res, 201, "Product add to  wish successfully.", wishData);
    } catch (error) {
        console.log(error)
        errorResponse(res, 500, "Something went wrong", error);
    }
};


const wishList = async (req, res) => {
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



        const wishData = await wishModel.aggregate([
            joinWithProductId,
            joinWithUserId,
            unwindProduct,
            unWindUser
        ]);


        if (wishData.length === 0) {
            return res.status(404).json({
                status: "fail",
                msg: "Wish not found"
            })
        }


        successResponse(res, 200, "Wish list find successfully", wishData);







    } catch (error) {
        errorResponse(res, 500, "Something went worng", error);

    }
};


const wishListDetails = async (req, res) => {
    const wishId = req.params.id;
    const match = {
        $match: {
            _id: new mongoose.Types.ObjectId(wishId)
        }
    };
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



        const wishData = await wishModel.aggregate([
            match,
            joinWithProductId,
            joinWithUserId,
            unwindProduct,
            unWindUser
        ]);


        if (wishData.length === 0) {
            return res.status(404).json({
                status: "fail",
                msg: "Wish not found"
            })
        }

        successResponse(res, 200, "Wish details retrive successfully", wishData);


    } catch (error) {

        errorResponse(res, 500, "Something went worng", error);

    }
};


const deleteWish = async (req, res) => {
    const wishId = req.params.id;
    const filter = {
        _id: wishId
    };
    try {
        const wishData = await wishModel.deleteOne(filter);
        if (!wishData) {
            return (
                res.status(404).json({
                    status: "fail",
                    msg: "Wish data not found"
                })
            )
        }


        successResponse(res, 200, "Wish delete successfully", wishData);



    } catch (error) {
        errorResponse(res, 500, "Something went worng", error)

    }
}






module.exports = {
    addWish,
    wishListDetails,
    wishList,
    deleteWish
}