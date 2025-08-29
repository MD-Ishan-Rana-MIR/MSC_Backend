const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const categorySchema = new Schema(
    {
        category_name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
            unique: true, // prevents duplicates
            minlength: [2, "Category name must be at least 2 characters long"],
            maxlength: [80, "Category name cannot exceed 80 characters"],
        },
        image: {
            type: String,
            required: [true, "Category image is required"],
            trim: true,
        },
    },
    { timestamps: true, versionKey: false }
);

// Case-insensitive unique index for category_name
categorySchema.index(
    { category_name: 1 },
    { unique: true, collation: { locale: "en", strength: 2 } }
);

const Category = model("Category", categorySchema);

module.exports = Category;
