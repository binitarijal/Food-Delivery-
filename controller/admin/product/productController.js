const Product = require("../../../model/productModel");
const catchAsync = require("../../../services/catchAsync");

exports.createProduct = async (req, res) => {
    const { productName, productDescription, productPrice, productStatus, productQuantity } = req.body;

    // Check if image was uploaded
    const file= req.file
    let filepath
    if(!file){
        filepath="https://img.freepik.com/free-photo/top-view-raw-rice-inside-plate-dark-desk_179666-27235.jpg?semt=ais_hybrid&w=740&q=80"
    }
    else{
        filepath= req.file.filename
    }

    // Validate other fields
    if (!productName || !productDescription || !productPrice || !productStatus || !productQuantity) {
        return res.status(400).json({
            message: "All product fields are required"
        });
    }

    // Create product with image filename
    await Product.create({
        productName,
        productDescription,
        productPrice,
        productQuantity,
        productStatus,
        image: "http://localhost:3000/ " +filepath
    });

    return res.status(201).json({
        message: "Product created successfully"
    });
};

/* ================= GET ALL PRODUCTS ================= */
exports.getProducts = async (req, res) => {
  
    const products = await Product.find();

    if (products.length === 0) {
      return res.status(404).json({
        message: "No products available",
        products: []
      });
    }

    return res.status(200).json({
      message: "Products fetched successfully",
      products
    });
  
};


/* ================= GET SINGLE PRODUCT ================= */
exports.getProduct =async (req, res) => {
 
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Product ID is required"
      });
    }

    // ❌ WRONG: Product.findOne(id)
    // ✅ CORRECT:
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "No product found"
      });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      product
    });

  
};
