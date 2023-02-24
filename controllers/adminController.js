const  Admin = require("../model/adminModel");
const User = require("../model/usermodel")
const adminLogin = async (req, res) => {
  try {
    const {userId, password} = req.body
    if (!userId || !password) {
      return res.json({status:false, message:"please enter all fields", response:[]});
    }

    // * Checking if Admin has registered or not
    let user = await Admin.findOne({ userId });
    if (!user) {
      return res.json({status:false, message:"invalid userId",response:[]});
    }
    if (user.password !== password) {
      return res.json({status:false, message:"invalid password",response:[]});
    }
    const token = user.generateToken();
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token: token,
      data: user,
    });
  } catch (error) {
    return res.json({status:false, message:error.message,response:[]});
  }
};

{/* //? Find All Requested Employees
export const getRequestEmployees = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res_failed(res, "Admin not passwordorized");
    }
    const employees = await Employee.find({ request: true });
    if (employees.length <= 0) {
      return res_success(res, "Employees Not Found", null);
    }
    res_success(res, "Employees Requests", employees);
  } catch (error) {
    res_catch(res, error);
  }
};

//? Find all verified employees
export const verifiedEmployee = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res_failed(res, "Admin not passwordorized");
    }
    const employees = await Employee.find({ isVerified: true });
    if (employees.length <= 0) {
      return res_failed(res, "Employees not found");
    }
    res_success(res, "Employees", employees);
  } catch (error) {
    res_catch(res, error);
  }
}; */}

//? Find Total Employees
const totalUsers = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.json({status:false, message:"Admin not authorised", response:[]});
    }
    const user = await User.find({});
    if (user.length <= 0) {
      return res.json({status:false, message:"Users not found", response:[]});
    }
    return res.json({status:true, message:"users fetch success", response:[user]});
  } catch (error) {
    return res.json({status:false, message:error.message, response:[]});
  }
};

{/*
//? Accept Employees
export const acceptEmployee = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res_failed(res, "Admin not passwordorized");
    }
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) {
      res_failed("Employee not found");
    }
    let subject = "Employee is Verified";
    for (let i = 0; i < employee.notification.length; i++) {
      if (employee.notification[i].subject === subject) {
        return res_success(res, "You have already sent a request");
      }
    }
    employee.request = true;
    employee.notification.push({
      subject,
      message:
        "Your request for Verification has been Accepted by the Administrator",
      time: Date.now(),
      expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
      display: true,
    });
    // employee.accept = true;
    employee.isVerified = true;
    employee.request = false;
    await employee.save();
    res_success(res, { message: "Accepted your request successfully" });
  } catch (error) {
    res_catch(500).json({ message: error.message });
  }
};

//? Decline Request
export const declineEmployee = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res_failed(res, "Admin not passwordorized");
    }
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) {
      res_failed("Employee not found");
    }
    let subject = "Request Declined";
    for (let i = 0; i < employee.notification.length; i++) {
      if (employee.notification[i].subject === subject) {
        return res_failed(res, "You have already sent a request");
      }
    }
    employee.request = true;
    employee.notification.push({
      subject,
      message:
        "Your request for Verification has been Declined by Administrator, You are not certified yet!",
      time: Date.now(),
      expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
      display: true,
    });
    employee.request = false;
    await employee.save();
    res_failed({ message: "Request is Declined!" });
  } catch (error) {
    res_catch(500).json({ message: error.message });
  }
}; */}


module.exports = {adminLogin , totalUsers};