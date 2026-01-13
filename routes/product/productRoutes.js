const { createProduct } = require('../../controller/admin/product/productController');
const { adminOnly } = require('../../middleware/adminonly');
const {  isAuthenticated } = require('../../middleware/authMiddleware');

const router=require('express').Router();

router.route('/createProduct').post(isAuthenticated,adminOnly,createProduct)
module.exports=router;