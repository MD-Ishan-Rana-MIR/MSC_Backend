const mongoose = require("mongoose");

const {Schema,model} = mongoose;


const brandSchema = new Schema({
    brand_name : {
        type : String,
    },
    image : {
        type : String
    }
},{
    timestamps:true,versionKey:false
});


const brandModel = model("brands",brandSchema);

module.exports = brandModel;