const categoryModel = require( "../model/categoryModel");
const slugify = require( "slugify");
const cloudinary = require("cloudinary")

//create category
// const createCategoryController = async (req, res) => {
//   try {
//     const { Cname } = req.body;
//     if (!Cname) {
//       return res.status(401).send({ message: "CName is required" });
//     }
//     const existingCategory = await categoryModel.findOne({ Cname });
//     if (existingCategory) {
//       return res.status(200).send({
//         success: false,
//         message: "Category Already Exisits",
//       });
//     }
//     const category = await new categoryModel({
//       Cname,
//       slug: slugify(Cname),
//       status :"active"
//       }).save();
//     res.status(201).send({
//       success: true,
//       message: "new category created",
//       category,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error in Category",
//     });
//   }
// };
// const createCategoryWithImage = async (req, res) => {
//   try {
//     const {Cname}  = req.body;
//     console.log(Cname)
//     if (!Cname) {
//       return res.status(401).send({ message: "CName is required" });
//     }
//     const existingCategory = await categoryModel.findOne({ Cname });
//     if (existingCategory) {
//       return res.status(200).send({
//         success: false,
//         message: "Category already exists",
//       });
//     }
//     const result = await cloudinary.v2.uploader.upload(req.file.path);
//     if (!result) {
//       return res.status(500).json({
//         success: false,
//         message: "Error while uploading image",
//       });
//     }
//     const category = await new categoryModel({
//       Cname,
//       slug: slugify(Cname),
//       status: "active",
//       avatar: {
//         public_id: result.public_id,
//         url: result.secure_url,
//       },
//     }).save();
//     res.status(201).send({
//       success: true,
//       message: "New category created with image upload",
//       category,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error in Category",
//     });
//   }
// };
const createCategoryWithImage = async (req, res) => {
  try {
    const { Cname } = req.body;
    console.log(Cname);
    if (!Cname) {
      return res.status(401).send({ message: "CName is required" });
    }
    const existingCategory = await categoryModel.findOne({ Cname });
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
      Cname,
      slug: slugify(Cname),
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
const updateCategoryController = async (req, res) => {
  try {
    const { Cname } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { Cname, slug: slugify(Cname) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      messsage: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

// get all cat
const categoryControlller = async (req, res) => {
  try {
    const category = await categoryModel.find({});
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
const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get SIngle Category SUccessfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Category",
    });
  }
};

//delete category
const deleteCategoryCOntroller = async (req, res) => {
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
      console.log(result)
      const { id } = req.params;
      const user = await categoryModel.findById(id);
      console.log("user" + user)
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
          });      }
  
      await user.save();
    //   res_success(res, "profile Updated", user.avatar);
    res.status(200).json({
        success: true,
        message: "Categry image upload Success",
        response:[user.avatar]
      });
    } catch (error) {
      // res_catch(res, error);
      res
        .status(500)
        .json({status:false, message: error.message, response:[] });
    }
  };
  


module.exports = {createCategoryWithImage, updateCategoryController, categoryControlller, singleCategoryController, deleteCategoryCOntroller, updateImage}