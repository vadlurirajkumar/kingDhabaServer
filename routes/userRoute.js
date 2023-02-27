const express = require("express")
const router = express.Router()
const {signupUser, verify,login,resendOtp } = require("../controllers/userController")
const isOtpAuth = require("../middleware/otpAuth")

// routes
router.post("/signup",signupUser)
router.post("/verify",isOtpAuth,verify)
router.post("/login",login)
router.post("/resendotp",resendOtp)




module.exports = router