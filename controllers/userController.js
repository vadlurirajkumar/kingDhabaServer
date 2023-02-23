const User = require("../model/usermodel");
const generateToken = require("../utils/jsonToken");
const generateOtp = require("../utils/otpGenerator");
require("../middleware/otpAuth");

const signupUser = async (req, res) => {
  try {
    const { fullname, email, mobile } = req.body;
    let exist = await User.findOne({ mobile });
    if (exist) {
      return res.status(400).json("user alredy exist");
    }
    let otp = generateOtp(4, true, false, false, false);
    let signupUser = new User({
      fullname,
      email,
      mobile,
      otp,
      otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000),
    });
    let token = generateToken(signupUser._id);
    await signupUser.save();
    res.status(200).json({ status: true, message: "user successfully created", response: [signupUser, { token: token }] });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const verify = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.data._id);
    if (user.otp !== otp || user.otp_expiry < Date.now()) {
      return res.json({ status: false, message: "Invalid OTP or has been Expired", response: [] });
    }
    user.otp = null;
    user.otp_expiry = null;
    await user.save();

    const token = generateToken(user);
    res.json({
      status: true,
      message: `Welcome ${user.fullname}, Logged in successfully`,
      response: [user, { token: token }],
    });
  } catch (error) {
    res.json({ status: false, message: error.message, response: [] });
  }
};

//? Resend OTP
const resendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    const user = await User.findById(req.data._id);
    //@ Generating OTP
    let otp = generateOtp(4, true, false, false, false);

    user.otp = otp;
    user.otp_expiry = new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000);
    await user.save();

    const token = generateToken(user._id);
    res.json({status:true,message:
      `OTP sent to : ${mobile}, please verify your mobile first`,
      response:[token,null]}
    );
  } catch (error) {
    res.json({ status: false, message: error.message, response: [] });
     ;
  }
};

//login

const login = async (req, res) => {
  try {
    const { mobile } = req.body;

    let user = await User.findOne({ mobile });

    //* Checking user has already exists or not with same Email
    if (!user) {
      return res.status(400).json("user not exist");
    }
    //@ Generating OTP
    let otp = generateOtp(4, true, false, false, false);

    const token = generateToken(user._id);
    user.otp = otp;
    user.otp_expiry = new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000);
    await user.save();


    // console.log(token)
    res.json({status:true,message:
      `OTP sent to : ${user.mobile}, please verify your mobile first`,response:[user,{token:token}]
  });
  } catch (error) {
    res.json({ status: false, message: error.message, response: [] });
  }
};


module.exports = { signupUser, verify, resendOtp, login };
