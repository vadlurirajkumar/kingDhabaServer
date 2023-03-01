const categoryModel = require("../model/categoryModel");
const slugify = require("slugify");
const cloudinary = require("cloudinary");

// create category

const createCategoryWithImage = async (req, res) => {
  try {
    const { categoryName } = req.body;
    console.log(categoryName);
    if (!categoryName) {
      return res.status(401).send({ message: "categoryName is required" });
    }
    const existingCategory = await categoryModel.findOne({ categoryName });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Category already exists",
      });
    }
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    if (!result) {
      return res.status(500).json({
        success: false,
        message: "Error while uploading image",
      });
    }
    const category = await new categoryModel({
      categoryName,
      slug: slugify(categoryName),
      status: "active",
      avatar: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    }).save();
    res.status(201).send({
      success: true,
      message: "New category created with image upload",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Category",
    });
  }
};

//update category

const updateCategory = async (req, res) => {
  try {
    const { categoryName, status } = req.body;
    const { id } = req.params;

    const user = await categoryModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (categoryName) {
      user.categoryName = categoryName;
      user.slug = slugify(categoryName);
    }

    if (status) {
      user.status = status;
    }

    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      if (!result) {
        return res.status(500).json({
          success: false,
          message: "Error while uploading image",
        });
      }

      if (user.avatar.public_id) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      }

      user.avatar.public_id = result.public_id;
      user.avatar.url = result.secure_url;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Category Updated Successfully",
      category: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while updating category",
      error,
    });
  }
};

// get all categories

const getAllCategories = async (req, res) => {
  try {
    const category = await categoryModel.find({ status: "active" });
    res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

// single category

const getSingleCategory = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    const name = category.categoryName;
    if (category && category.status === "active") {
      return res.status(200).send({
        success: true,
        message: "Get Single Category Successfully",
        category,
      });
    } else if (category && category.status === "inactive") {
      return res.status(200).send({
        success: false,
        message: `Category - ${name} is inactive, please contact admin to activate it`,
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting Single Category",
    });
  }
};

//delete category

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Categry Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while deleting category",
      error,
    });
  }
};

// update category picture
const updateImage = async (req, res) => {
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    console.log(result);
    const { id } = req.params;
    const user = await categoryModel.findById(id);
    console.log("user" + user);
    let image = await user.avatar.public_id;
    if (result) {
      if (!image) {
        user.avatar.public_id = result.public_id;
        user.avatar.url = result.secure_url;
      } else {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);

        user.avatar.public_id = result.public_id;
        user.avatar.url = result.secure_url;
      }
    } else {
      res.status(500).json({
        success: false,
        message: "error while updating image",
        error,
      });
    }

    await user.save();
    //   res_success(res, "profile Updated", user.avatar);
    res.status(200).json({
      success: true,
      message: "Categry image upload Success",
      response: [user.avatar],
    });
  } catch (error) {
    // res_catch(res, error);
    res
      .status(500)
      .json({ status: false, message: error.message, response: [] });
  }
};

module.exports = {
  createCategoryWithImage,
  updateCategory,
  getAllCategories,
  getSingleCategory,
  deleteCategory,
  updateImage,
};
