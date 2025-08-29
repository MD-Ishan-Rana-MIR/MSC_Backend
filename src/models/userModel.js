const mongoose = require("mongoose");

const {Schema,model} = mongoose;


const userSchema = new Schema({
    full_name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    confirm_password : {
        type : String,
        // required : true
    },
    isBand : {
        type : Boolean,
        default : false
    },
    role : {
        type : String ,
        enum : ["admin","user"],
        default : "user"
    }
},{timestamps:true,versionKey:false});


const userModel = model("users",userSchema);

module.exports = userModel;