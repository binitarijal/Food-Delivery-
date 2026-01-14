const router=require('express').Router();
const {registerUser,loginUser, forgetPassword,verifyOtp, resetPassword, adminLogin}=require('../../controller/auth/authController');
const catchAsync = require('../../services/catchAsync');
router.route('/register').post(catchAsync(registerUser));
router.route('/login').post(catchAsync(loginUser));
router.route('/forgetpassword').post(catchAsync(forgetPassword))
router.route('/verifyOtp').post(catchAsync(verifyOtp))
router.route('/resetPassword').post(catchAsync(resetPassword))
router.route('/admin/login').post(catchAsync(adminLogin))
module.exports=router;