
const brandModel = require("../models/brandModel");
const { errorResponse, successResponse } = require("../utility/response");
const fs = require("fs");
const path = require("path");

const createBrand = async (req, res) => {
    try {
        const { brand_name, image } = req.body;
        if (!brand_name || !image) {
            return res.status(400).json({ message: "Brand name and image is required" });
        }

        const brand = await brandModel.create({
            brand_name,
            image,
        });

        res.status(201).json({ message: "Brand created", brand });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const singleBrand = async (req, res) => {
    const brand_id = req.params.brand_id;
    try {
        const filter = {
            _id: brand_id
        };


        const singleData = await brandModel.findOne(filter);

        if (!singleData) {
            return (
                res.status(404).json({
                    status: "success",
                    data: "Brand not found"
                })
            )
        }

        successResponse(res, 200, "Single brand retrive successfully", singleData)


    } catch (error) {
        errorResponse(res, 500, "Something went wrong", error)
    }
};

const allBrand = async (req, res) => {
    try {
        const brandData = await brandModel.find().sort({ createdAt: -1 });
        if (brandData.length === 0) {
            return (
                res.status(404).json({
                    status: "fail",
                    message: "Brand not found"
                })
            )
        }
        return res.status(200).json({
            success: true,
            data: brandData
        });
    } catch (error) {
        return res.status(500).json({
            satus: "fail",
            message: "Server error",
            error: error.message
        });
    }
};

const brandUpdate = async (req, res) => {
    try {
        const brandId = req.params.id;
        const { brand_name, image } = req.body;

        const brand = await brandModel.findById(brandId);
        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }
        // ✅ brand_name update
        if (brand_name) brand.brand_name = brand_name;
        if (image) brand.image = image;
        await brand.save();
        res.status(200).json({
            message: "Brand updated successfully",
            brand
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const brandDelete = async (req, res) => {
    const brandId = req.params.id;
    try {
        const filter = {
            _id: brandId
        };
        const brandData = await brandModel.findOne(filter);
        if (!brandData) {
            return (
                res.status(404).json({
                    status: "fail",
                    msg: "Brand not found"
                })
            )
        }
        await brandModel.deleteOne(filter);
        return res.status(200).json({
            status: "success",
            msg: "Brand delete successfully"
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};






module.exports = { createBrand, singleBrand, brandUpdate, brandDelete, allBrand };