const categoryModel = require("../models/categoryModel");
const { errorResponse, successResponse } = require("../utility/response");


const createCategory = async (req, res) => {
    try {
        const { category_name, image } = req.body;

        if (!category_name) {
            return res.status(400).json({ message: "Category name is required" });
        }
        const category = await categoryModel.create({
            category_name,
            image
        });

        res.status(201).json({ message: "Category created", category });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const singleCategory = async (req, res) => {
    const category_id = req.params.category_id;
    try {
        const filter = {
            _id: category_id
        };


        const singleData = await categoryModel.findOne(filter);

        if (!singleData) {
            return (
                res.status(404).json({
                    status: "success",
                    data: "Category not found"
                })
            )
        }



        successResponse(res, 200, "Single category retrive successfully", singleData)


    } catch (error) {
        errorResponse(res, 500, "Something went wrong", error)
    }
};

const allCategory = async (req, res) => {
    try {
        const categoryData = await categoryModel.find().sort({ createdAt: -1 });
        if (categoryData.length === 0) {
            return (
                res.status(404).json({
                    status: "fail",
                    message: "Category not found"
                })
            )
        }
        return res.status(200).json({
            success: true,
            data: categoryData
        });
    } catch (error) {
        return res.status(500).json({
            satus: "fail",
            message: "Server error",
            error: error.message
        });
    }
};

const categoryUpdate = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { category_name, image } = req.body;

        const category = await categoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // category_name update
        if (category_name) category.category_name = category_name;

        // image update
        if (image) category.image = image;

        await category.save();

        res.status(200).json({
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const categoryDelete = async (req, res) => {
    const categoryId = req.params.id;
    try {
        const filter = {
            _id: categoryId
        };
        const categoryData = await categoryModel.findOne(filter);
        if (!categoryData) {
            return (
                res.status(404).json({
                    status: "fail",
                    msg: "Category not found"
                })
            )
        }
        const data = await categoryModel.deleteOne(filter);
        return res.status(200).json({
            status: "success",
            msg: "Category delete successfully"
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};






module.exports = { createCategory, singleCategory, categoryUpdate, categoryDelete, allCategory };