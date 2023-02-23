const mongoose = require("mongoose")

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
})

const User = new mongoose.model("User", userSchema)

module.exports = User