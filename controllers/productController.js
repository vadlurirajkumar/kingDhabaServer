const productModel = require("../model/productModel");
const categoryModel = require("../model/categoryModel")
const cloudinary = require("cloudinary");

// create a product
const createProduct = async (req, res) => {
  try {
    const { productName, description, price,  categoryId, foodType } = req.body;
    console.log(productName, description, price,  categoryId, foodType);
    if (!productName || !description || !price || !categoryId || !foodType) {
      return res
        .status(401)
        .send({status:false, message: "All fields are required" });
    }
    const existingProduct = await productModel.findOne({ productName });
    if (existingProduct) {
      return res.status(200).send({
        status: false,
        message: "Product already exists",
      });
    }
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    if (!result) {
      return res.status(500).json({
        status: false,
        message: "Error while uploading image",
      });
    }
    const product = await new productModel({
      productName,
      description,
      price,
      categoryId,
      status: "active",
      foodType,
      avatat: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    }).save();
    await categoryModel.findByIdAndUpdate(
      categoryId,
      {
        $push: { products: product },
      },
      { new: true }
    );
    res.status(201).send({
      status: true,
      message: "New product created with image upload",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error in creating product",
    });
  }
};

// get all products
const getAllProducts = async (req, res) => {
  try {
    const product = await productModel.find({ status: "active" });
    res.status(200).send({
      status: true,
      message: "All Products List",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting all products",
    });
  }
};

//get single product
const getSingleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    const name = product.productName;
    if (product && product.status === "active") {
      return res.status(200).send({
        status: true,
        message: "Get Single product sucessfully",
        product,
      });
    } else if (product && product.status === "inactive") {
      return res.status(200).send({
        status: false,
        message: `product - ${name} is inactive, please contact admin to activate it`,
      });
    } else {
      return res.status(404).send({
        status: false,
        message: "product not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting Single product",
    });
  }
};

//get all veg products
const getAllVegProducts = async (req, res) => {
  try {
    const product = await productModel.find({ status: "active" , foodType:"veg"});
    res.status(200).send({
      status: true,
      message: "All Products List",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting all products",
    });
  }
};

//get all non-veg products
const getAllNonVegProducts = async (req, res) => {
  try {
    const product = await productModel.find({ status: "active" , foodType:"non-veg"});
    res.status(200).send({
      status: true,
      message: "All Products List",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting all products",
    });
  }
};

// update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, description, price, categoryId, foodType, avatar, status } = req.body;
    const fieldsToUpdate = {};
    if (productName) fieldsToUpdate.productName = productName;
    if (description) fieldsToUpdate.description = description;
    if (price) fieldsToUpdate.price = price;
    if (categoryId) fieldsToUpdate.categoryId = categoryId;
    if (foodType) fieldsToUpdate.foodType = foodType;
    if (avatar) {
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      if (!result) {
        return res.status(500).json({
          status: false,
          message: "Error while uploading image",
        });
      }
      fieldsToUpdate.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }
    if (status) fieldsToUpdate.status = status;
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      fieldsToUpdate,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }
    res.status(200).send({
      status: true,
      message: "Product updated sucessfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error in updating product",
    });
  }
};

// delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productModel.findByIdAndDelete(id);
    res.status(200).send({
      status: true,
      message: "product Deleted sucessfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "error while product category",
      error,
    });
  }
};



module.exports = {createProduct, getAllProducts, getSingleProduct, getAllVegProducts, getAllNonVegProducts, updateProduct, deleteProduct}