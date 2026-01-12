const router=require('express').Router();
const {registerUser,loginUser, forgetPassword}=require('../../controller/auth/authController');
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/forgetpassword').post(forgetPassword)
module.exports=router;