const Product = require("../../../model/productModel");
const fs= require('fs')
require('dotenv').config();
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
        image: process.env.BACKEnd_URI+filepath
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


exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  // 1️⃣ ID validation
  if (!id) {
    return res.status(400).json({
      message: "Product ID is required"
    });
  }
 

  
  const oldProductImage= product.image
  const lengthToCut= process.env.BACKEnd_URI.length
  const finalpathAfterCut= oldProductImage.slice(lengthToCut)

  
    fs.unlink("./uploads"+finalpathAfterCut,(err)=>{
      if(err){
        console.log("error deleting file");
      }else{
        console.log("successfully deleted file")
      }
    })
  


  // 2️⃣ Delete product
  const deletedProduct = await Product.findByIdAndDelete(id);

  // 3️⃣ If product not found
  if (!deletedProduct) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  // 4️⃣ Success response
  return res.status(200).json({
    success:true,
    message: "Product deleted successfully",
  });
};



exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const {productName, productDescription, productPrice, productQuantity, productStatus}= req.body
  if(!productName || !productDescription || !productPrice || !productQuantity || !productStatus || !id){
    return res.status(400).json({
      message:"provide all fields to update",
    })
  }
  // 2️⃣ Check if product exists
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  // 3️⃣ Update product

  const oldProductImage= product.image
  const lengthToCut= process.env.BACKEnd_URI.length
  const finalpathAfterCut= oldProductImage.slice(lengthToCut)
  if(req.file || req.file.filename){
    fs.unlink("./uploads"+finalpathAfterCut,(err)=>{
      if(err){
        console.log("error deleting file");
      }else{
        console.log("successfully deleted file")
      }
    })
  }
  const updatedProduct = await Product.findByIdAndUpdate(
    id,{
       productName,
        productDescription,
        productPrice,
        productQuantity,
        productStatus,
        image: req.file && req.file.filename? process.env.BACKEnd_URI+req.file.filename: oldProductImage
    },{
      new:true,
      runValidators:true
    }
  );

  // 4️⃣ Send response
  return res.status(200).json({
    message: "Product updated successfully",
    product: updatedProduct
  });
};

