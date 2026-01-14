const User = require("../../../model/userModel");

 exports.getUsers=async(req,res)=>{

 const user= await User.find()
 if(user.length>0){
    res.status(200).json({
        message:"user fetched successfully",
        data:user
    })
 }else{

    res.status(400).json({
        message:"user collection is empty",
        data:[]
    })
 }
 }