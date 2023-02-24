const express = require("express");
const {adminLogin, totalUsers} = require("../controllers/adminController")
// import { acceptEmployee, adminLogin, declineEmployee, getRequestEmployees, totalEmployees, verifiedEmployee } from "../controllers/admin.service.js";
const isAdminAuth = require("../middleware/adminAuth");

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
// adminRouter.get("/getrequest", isAdminAuth, getRequestEmployees);
// adminRouter.get("/verifiedemp", isAdminAuth, verifiedEmployee);
adminRouter.get("/allusers", isAdminAuth, totalUsers);
// adminRouter.patch("/accept-request/:id", isAdminAuth, acceptEmployee);
// adminRouter.patch("/decline/:id", isAdminAuth, declineEmployee);

module.exports =  adminRouter;