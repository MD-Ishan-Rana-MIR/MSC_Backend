const productModel = require("../models/productModel");
const fs = require("fs");
const path = require("path");
const { errorResponse } = require("../utility/response");
const { default: mongoose } = require("mongoose");

const createProduct = async (req, res) => {
    try {
        const {
            category_id,
            brand_id,
            product_name,
            product_type,
            price,
            discount_price,
            product_color,
            size,
            product_image_1,
            product_image_2,
            product_image_3,
            product_image_4
        } = req.body;

        // ✅ required fields check
        if (!category_id || !brand_id || !product_name || !product_type || !price || !size || !product_image_1 || !product_color) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        // ✅ product_color check (parse safely if string)
        let parsedColors;
        try {
            parsedColors = typeof product_color === "string" ? JSON.parse(product_color) : product_color;
            if (!Array.isArray(parsedColors)) {
                throw new Error("product_color must be an array");
            }
        } catch (err) {
            return res.status(400).json({ message: "Invalid product_color format. Must be a valid JSON array." });
        }

        // ✅ create product
        const product = await productModel.create({
            category_id,
            brand_id,
            product_name,
            product_type,
            price,
            discount_price,
            product_color: parsedColors,
            product_image_1,
            product_image_2,
            product_image_3,
            product_image_4,
            size
        });

        res.status(201).json({ message: "Product uploaded successfully.", product });
    } catch (error) {
        console.error("❌ Product creation error:", error);
        res.status(500).json({ error: error.message });
    }
};

const singleProduct = async (req, res) => {
    const productId = req.params.id;

    const isMatch = { $match: { _id: new mongoose.Types.ObjectId(productId) } };

    try {
        const joinWithCategoryId = {
            $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category"
            }
        };

        const unwindCategory = { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } };

        const joinWithBrandId = {
            $lookup: {
                from: "brands",
                localField: "brand_id",
                foreignField: "_id",
                as: "brand"
            }
        };

        const unwindBrand = { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } };

        const product = await productModel.aggregate([
            isMatch,
            joinWithCategoryId,
            unwindCategory,
            joinWithBrandId,
            unwindBrand
        ]);

        if (!product || product.length === 0) {
            return res.status(404).json({
                status: "fail",
                msg: "Product not found"
            });
        }

        return res.status(200).json({
            status: "success",
            msg: "Single product retrieved successfully",
            data: product[0] // return the single product object
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            msg: "Something went wrong",
            error: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const {
            category_id,
            brand_id,
            product_name,
            product_type,
            price,
            discount_price,
            product_color
        } = req.body;

        // find product
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // update basic fields
        if (category_id) product.category_id = category_id;
        if (brand_id) product.brand_id = brand_id;
        if (product_name) product.product_name = product_name;
        if (product_type) product.product_type = product_type;
        if (price) product.price = price;
        if (discount_price) product.discount_price = discount_price;
        if (product_color) product.product_color = JSON.parse(product_color);

        // handle images
        if (req.files && Object.keys(req.files).length > 0) {
            const keys = ["product_image[0]", "product_image[1]", "product_image[2]", "product_image[3]"];
            const images = [];

            // delete old images from uploads folder
            product.product_image.forEach(imgPath => {
                const oldPath = path.join(__dirname, "..", imgPath);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            });

            // add new images
            keys.forEach(key => {
                if (req.files[key]) {
                    const relativePath = path.join("/uploads", path.basename(req.files[key][0].path));
                    images.push(relativePath.replace(/\\/g, "/"));
                }
            });

            product.product_image = images.length > 0 ? images : product.product_image;
        } else {
            // user did not provide new images → keep old images
            if (!product.product_image || product.product_image.length === 0) {
                product.product_image = ["/uploads/default.png"];
            }
        }

        await product.save();

        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
};


module.exports = {
    createProduct,
    updateProduct,
    singleProduct
}