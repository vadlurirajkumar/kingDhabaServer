const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  slug: {
    type: String,
    lowercase: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active", // Set the default value for the status field to "active"
  },
  avatar: {
    public_id: String,
    url: String,
  }
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
