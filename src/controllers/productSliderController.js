const productSliderModel = require("../models/productSlider");
const { successResponse, errorResponse } = require("../utility/response");





const productSliderCreate = async (req, res) => {
    const reqBody = req.body;
    try {

        const data = await productSliderModel.create(reqBody);
        successResponse(res, 201, "Product Slider upload successfully", data);

    } catch (error) {

        errorResponse(res, 500, "Something went wrong", error)

    }
};

const allSlider = async (req, res) => {
    try {
        const data = await productSliderModel.find();

        if (data.length === 0) {
            errorResponse(res, 404, "Data not found", null)
        }

        successResponse(res, 200, "Data retrive successfully", data)

    } catch (error) {

        errorResponse(res,500,"Something went wrong",error)

    }
};



module.exports = {
    productSliderCreate,
    allSlider
}