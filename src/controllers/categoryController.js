const categoryModel = require("../models/categoryModel");
const { errorResponse, successResponse } = require("../utility/response");


const createCategory = async (req, res) => {
    try {
        const { category_name } = req.body;

        if (!category_name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image file is required" });
        }

        const category = await categoryModel.create({
            category_name,
            image: `/uploads/${req.file.filename}`, // saved path
        });

        res.status(201).json({ message: "Category created", category });
    } catch (error) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "File too large. Max 5MB allowed." });
        }
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


const categoryUpdate = async (req,res) => {
    try {
        const categoryId = req.params.id;
        const { category_name } = req.body;

        const category = await categoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        if (req.file) {
            if (category.image) {
                const oldImagePath = path.join(__dirname, "../", category.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            category.image = `/uploads/${req.file.filename}`;
        }

        // category_name update
        if (category_name) category.category_name = category_name;

        await category.save();

        res.status(200).json({ message: "Category updated successfully", category });
    } catch (error) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "File too large. Max 4MB allowed." });
        }
        res.status(500).json({ error: error.message });
    }
}






module.exports = { createCategory, singleCategory, categoryUpdate };