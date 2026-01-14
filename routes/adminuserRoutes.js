const User = require('../model/userModel');
const { adminOnly } = require('./../middleware/adminonly');
const {  isAuthenticated } = require('./../middleware/authMiddleware');
const catchAsync = require('./../services/catchAsync');
const router = require('express').Router();

router.route('/users').get(isAuthenticated,adminOnly  ,catchAsync(User) )

module.exports=router;