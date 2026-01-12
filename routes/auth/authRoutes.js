const router=require('express').Router();
const {registerUser,loginUser, forgetPassword,verifyOtp, resetPassword, adminLogin}=require('../../controller/auth/authController');
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/forgetpassword').post(forgetPassword)
router.route('/verifyOtp').post(verifyOtp)
router.route('/resetPassword').post(resetPassword)
router.route('/admin/login').post(adminLogin)
module.exports=router;