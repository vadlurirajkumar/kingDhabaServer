const Admin = require("../model/adminModel");
const User = require("../model/usermodel");

// admin Login
const adminLogin = async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.json({
        status: false,
        message: "please enter all fields",
        response: [],
      });
    }

    // * Checking if Admin has registered or not
    let user = await Admin.findOne({ userId });
    if (!user) {
      return res.json({
        status: false,
        message: "invalid userId",
        response: [],
      });
    }
    if (user.password !== password) {
      return res.json({
        status: false,
        message: "invalid password",
        response: [],
      });
    }
    const token = user.generateToken();
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token: token,
      data: user,
    });
  } catch (error) {
    return res.json({ status: false, message: error.message, response: [] });
  }
};

// Find Total Users
const totalUsers = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.json({
        status: false,
        message: "Admin not authorised",
        response: [],
      });
    }
    const user = await User.find({});
    if (user.length <= 0) {
      return res.json({
        status: false,
        message: "Users not found",
        response: [],
      });
    }
    return res.json({
      status: true,
      message: "users fetch success",
      response: [user],
    });
  } catch (error) {
    return res.json({ status: false, message: error.message, response: [] });
  }
};

// this is for admin will get only user status "active" only

// const totalUsers = async (req, res) => {
//   try {
//     const admin = await Admin.findById(req.admin.id);
//     if (!admin) {
//       return res.json({status:false, message:"Admin not authorised", response:[]});
//     }
//     const users = await User.find({status: 'active'});
//     if (users.length <= 0) {
//       return res.json({status:false, message:"Users not found", response:[]});
//     }
//     return res.json({status:true, message:"users fetch success", response:[users]});
//   } catch (error) {
//     return res.json({status:false, message:error.message, response:[]});
//   }
// };

// updateUser_status
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(id, { status });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found", response: [] });
    }

    return res
      .status(200)
      .json({
        status: true,
        message: "User updated successfully",
        response: [user],
      });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, response: [] });
  }
};

// delete a user
const deleteUser = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.json({
        status: false,
        message: "Admin not authorised",
        response: [],
      });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.json({
        status: false,
        message: "User not found",
        response: [],
      });
    }
    return res.json({
      status: true,
      message: "User deleted successfully",
      response: user,
    });
  } catch (error) {
    return res.json({ status: false, message: error.message, response: [] });
  }
};

//? Update picture
const updateImage = async (req, res) => {
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const user = await Employee.findById(req.user._id);
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
      res.json({
        status: false,
        message: "Error - profile update failed",
        response: [],
      });
    }

    await user.save();
    res.json({
      status: true,
      message: "Image Updated",
      response: [user.avatar],
    });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: error.message,
        response: ["path not found error"],
      });
  }
};

//? Delete  picture
const deleteImage = async (req, res) => {
  try {
    const user = await Employee.findById(req.user._id);
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    user.avatar.public_id = "";
    user.avatar.url = "";
    await user.save();
    res.json({
      status: true,
      message: "Image Deleted",
      response: [user.avatar],
    });
  } catch (error) {
    res.json({ status: false, message: error.message, response: [] });
  }
};

module.exports = { adminLogin, totalUsers, updateUserStatus, deleteUser };
