const express = require("express");
const catRoute = express.Router();
const isAdminAuth = require("../middleware/adminAuth");
const {
  categoryControlller,
  createCategoryWithImage,
  deleteCategoryCOntroller,
  singleCategoryController,
  updateCategoryController,
  updateImage
} = require("./../controllers/categoryController");
const uploadImage = require("../utils/multer")

//routes
// create category
catRoute.post("/create-category", isAdminAuth, uploadImage.single('avatar'),  createCategoryWithImage);

//update category
catRoute.put("/update-category/:id", isAdminAuth, updateCategoryController);

//getALl category
catRoute.get("/get-category", categoryControlller);

//single category
catRoute.get("/single-category/:slug", singleCategoryController);

//delete category
catRoute.delete("/delete-category/:id", isAdminAuth, deleteCategoryCOntroller);

// updating category image
catRoute.patch("/updateimg/:id", isAdminAuth, uploadImage.single('image'), updateImage);


module.exports =  catRoute;














// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const Category = require("../model/categoryModel");

// // Set up cloudinary storage for multer
// const cloudinaryStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "category",
//     allowed_formats: ["jpg", "jpeg", "png"],
//     transformation: [{ width: 500, height: 500, crop: "limit" }],
//   },
// });

// const upload = multer({ storage: cloudinaryStorage });

// // Create a new category with image upload
// router.post("/create-category", upload.single("avatar"), async (req, res) => {
//   try {
//     const { Cname } = req.body;
//     if (!Cname) {
//       return res.status(400).json({ message: "Category name is required" });
//     }

//     const existingCategory = await Category.findOne({ Cname });
//     if (existingCategory) {
//       return res
//         .status(400)
//         .json({ message: "Category already exists with that name" });
//     }

//     const newCategory = new Category({
//       Cname,
//       avatar: {
//         url: req.file.path,
//         public_id: req.file.filename.split(".")[0],
//       },
//     });

//     await newCategory.save();

//     res.status(201).json({
//       message: "New category created with image upload",
//       category: newCategory,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;
