const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../../controller/admin/product/productController');
const { adminOnly } = require('../../middleware/adminonly');
const {  isAuthenticated } = require('../../middleware/authMiddleware');
const { multer, storage } = require('../../middleware/multerConfig');
const catchAsync = require('../../services/catchAsync');
const router = require('express').Router();
const upload = multer({ storage: storage });

// Use upload.single('image') if you plan to accept a single file named 'image'
router.route('/Products').post(isAuthenticated, adminOnly, upload.single('image'), catchAsync(createProduct) ).get(catchAsync(getProducts))
router.route('/product/:id').get(catchAsync(getProduct)).patch(isAuthenticated,adminOnly,  catchAsync(updateProduct)).delete( isAuthenticated,adminOnly,  catchAsync(deleteProduct))
module.exports=router;