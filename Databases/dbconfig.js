const mongoose=require('mongoose');
const mongoURI=process.env.MONGO_URI;

exports.connectDB=async()=>{
    await mongoose.connect(mongoURI)
    console.log("MongoDB connected successfully");

}