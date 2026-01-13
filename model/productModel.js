const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
productName:{
    type:String,
    required:[true,'product name is required'],
    unique:true
},
productDescription:{
    type:String,
    required:[true,'Product Description is required'],
    unique:true
},
productPrice: {
    type: Number,
    required: [true, 'Price is required'],
},
productStatus: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available'
},

productQuantity:{
    type: Number,
    required:[true,"Quantity is required"]
},

},
{timestamps: true})

const Product=mongoose.model('Product',productSchema);

module.exports=Product;