const express = require("express");
const catRoute = express.Router();
const isAdminAuth = require("../middleware/adminAuth");
const {
  categoryControlller,
  createCategoryController,
  deleteCategoryCOntroller,
  singleCategoryController,
  updateCategoryController,
  updateImage
} = require("./../controllers/categoryController");
const uploadImage = require("../utils/multer")

//routes
// create category
catRoute.post("/create-category", isAdminAuth, createCategoryController);

//update category
catRoute.put("/update-category/:id", isAdminAuth, updateCategoryController);

//getALl category
catRoute.get("/get-category", isAdminAuth, categoryControlller);

//single category
catRoute.get("/single-category/:slug", isAdminAuth, singleCategoryController);

//delete category
catRoute.delete("/delete-category/:id", isAdminAuth, deleteCategoryCOntroller);

// updating category image
catRoute.patch("/updateimg/:id", isAdminAuth, uploadImage.single('image'), updateImage);


module.exports =  catRoute;
