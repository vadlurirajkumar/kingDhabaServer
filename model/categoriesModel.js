const mongoose = require("mongoose")

const categoriesSchema = new mongoose.Schema({
    avatar:{
        public_id: String,
        url: String
    },
    categoryname:{
        type:String,
        required:true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active" // Set the default value for the status field to "active"
      }
},{timestamps:true})


const Categories = new mongoose.model("Categories", categoriesSchema)

module.exports = Categories