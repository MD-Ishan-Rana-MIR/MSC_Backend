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

        errorResponse(res, 500, "Something went wrong", error)

    }
};

const singleSlider = async (req, res) => {
    const id = req.params.id;
    const filter = {
        _id: id
    };
    try {
        const data = await productSliderModel.findOne(filter);
        if (!data) {
            errorResponse(res, 404, "Slider not found", null)
        }
        successResponse(res, 200, "Slider retrive successfully", data)
    } catch (error) {
        errorResponse(res, 500, "Something went wrong", error)
    }
};

const sliderUpdate = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await productSliderModel.findByIdAndUpdate(
            id, // ✅ pass only the id
            req.body,
            { new: true } // ✅ return updated doc, no upsert unless you need it
        );

        if (!data) {
            return errorResponse(res, 404, "Slider not found", null);
        }

        return successResponse(res, 200, "Slider updated successfully", data);

    } catch (error) {
        console.error(error);
        return errorResponse(res, 500, "Something went wrong", null);
    }
};

const sliderDelete = async (req, res) => {
    const id = req.params.id;
    const filter = {
        _id: id
    }
    try {
        const data = await productSliderModel.findByIdAndDelete(filter);
        if (!data) {
            errorResponse(res, 404, "Slider not found", null)
        }

        successResponse(res, 200, "Slider delete successfully", data);

    } catch (error) {

        errorResponse(res, 500, "Something went worng", error)

    }
}



module.exports = {
    productSliderCreate,
    allSlider,
    singleSlider,
    sliderUpdate,
    sliderDelete
}