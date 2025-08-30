const mongoose = require("mongoose");

const {Schema,model} = mongoose;


const categorySchema = new Schema({
    category_name : {
        type : String,
    },
    image : {
        type : String
    }
},{
    timestamps:true,versionKey:false
});


const categoryModel = model("categories",categorySchema);

module.exports = categoryModel;