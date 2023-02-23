const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String
    },
    mobile:{
        type:Number,
        required:true,
        unique:true
    },
    otp:{
        type:String
    },
    otp_expiry:{ 
        type:Date
    }
},{timestamps:true})

userSchema.index({ otp_expiry: 1 }, { expireAfterSeconds: 0 });

const User = new mongoose.model("User", userSchema)

module.exports = User