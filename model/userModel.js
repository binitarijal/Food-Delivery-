const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
userEmail:{
    type:String,
    required:[true,'Email is required'],
    unique:true
},
userPhonenumber:{
    type:String,
    required:[true,'Phone number is required'],
    unique:true
},
userPassword:{
    type:String,
    required:[true,'Password is required'],

},
role:{
    type:String,
    enum:['user','admin'],
    default:'user'
},
resetOtp:{
    type:String
},
resetOtpExpiry: {
    type:Date
},
resetPasswordAllowed: {
  type: Boolean,
  default: false
}



})

const User=mongoose.model('User',userSchema);

module.exports=User;