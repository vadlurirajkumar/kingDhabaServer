const express = require("express");
const categoryRoute = express.Router();
const isAdminAuth = require("../middleware/adminAuth");
const {
  getAllCategories,
  createCategoryWithImage,
  deleteCategory,
  getSingleCategory,
  updateCategory,
  updateImage,
} = require("./../controllers/categoryController");
const uploadImage = require("../utils/multer");

//routes

// create category
categoryRoute.post(
  "/create-category",
  isAdminAuth,
  uploadImage.single("avatar"),
  createCategoryWithImage
);

//update category
categoryRoute.patch(
  "/update-category/:id",
  isAdminAuth,
  uploadImage.single("avatar"),
  updateCategory
);

//getALl category
categoryRoute.get("/get-category", getAllCategories);

//single category
categoryRoute.get("/single-category/:id", getSingleCategory);

//delete category
categoryRoute.delete("/delete-category/:id", isAdminAuth, deleteCategory);

// updating category image
categoryRoute.patch(
  "/updateimg/:id",
  isAdminAuth,
  uploadImage.single("avatar"),
  updateImage
);

module.exports = categoryRoute;
