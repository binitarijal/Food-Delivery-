const Product = require("../../../model/productModel")

exports.createProduct=async(req,res)=>{
    const {productName, productDescription,productPrice, productStatus,productQuantity}=req.body
    if(!productName || !productDescription || !productPrice || !productStatus || !productQuantity){
        return res.status(400).json({
            message:"all product fields required"
        })
    }

await Product.create({
    productName,
    productDescription,
    productPrice,
    productQuantity,
    productStatus
})
return res.status(201).json({
    message:"products created successfully"
})
}