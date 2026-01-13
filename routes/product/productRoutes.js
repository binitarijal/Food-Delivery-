const { createProduct } = require('../../controller/admin/product/productController');
const { adminOnly } = require('../../middleware/adminonly');
const {  isAuthenticated } = require('../../middleware/authMiddleware');
const { multer, storage } = require('../../middleware/multerConfig');
const router = require('express').Router();
const upload = multer({ storage: storage });

// Use upload.single('image') if you plan to accept a single file named 'image'
router.route('/createProduct').post(isAuthenticated, adminOnly, upload.single('image'), createProduct)
module.exports=router;