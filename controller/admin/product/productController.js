const Product = require("../../../model/productModel");

exports.createProduct = async (req, res) => {
    const { productName, productDescription, productPrice, productStatus, productQuantity } = req.body;

    // Check if image was uploaded
    if (!req.file) {
        return res.status(400).json({
            message: "Image file is required"
        });
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
        image: req.file.filename // Save the image filename
    });

    return res.status(201).json({
        message: "Product created successfully"
    });
};
