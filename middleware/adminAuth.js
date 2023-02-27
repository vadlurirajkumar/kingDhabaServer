const jwt = require("jsonwebtoken");
const  Admin  = require("../model/adminModel");

 const isAdminAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
    res.status(500).json({status:false, message:"token not found please login first", response:[]})
      // console.log("auth " + authorization);
    }
    const token = authorization.split(" ")[1];
    // console.log("token " + token);

    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded._id);
    // console.log(req.user._id)
    next();
  } catch (error) {
    res.status(500).json({status:false, message: "auth error", response:error.message });
  }
};

module.exports = isAdminAuth