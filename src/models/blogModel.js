const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const blogSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        // required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    isPublish: {
        type: Boolean,
        default: false
    }


}, { timestamps: true, versionKey: false });

const blogModel = model("blog", blogSchema);


module.exports = blogModel;