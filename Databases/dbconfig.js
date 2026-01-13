const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../model/userModel");

const mongoURI = process.env.MONGO_URI;

exports.connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");

    // 🔹 Check if admin exists
    const isAdminExist = await User.findOne({
      userEmail: "admin@gmail.com",
    });

    if (!isAdminExist) {
      // 🔹 Hash password
      const hashedPassword = await bcrypt.hash("admin", 10);

      await User.create({
        userEmail: "admin@gmail.com",
        userPassword: hashedPassword,
        role: "admin",
        userPhonenumber: "849487",
      });

      console.log("Admin seeded successfully");
    } else {
      console.log("Admin already exists");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
