const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../../model/userModel");
const sendEmail = require("../../services/sendEmail");

/* ================= REGISTER ================= */
exports.registerUser = async (req, res) => {
  try {
    const { userEmail, userPhonenumber, userPassword, role } = req.body;

    if (!userEmail || !userPhonenumber || !userPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const user = await User.create({
      userEmail,
      userPhonenumber,
      userPassword: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= LOGIN ================= */
exports.loginUser = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;

    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    const isMatch = await bcrypt.compare(
      userPassword,
      user.userPassword
    );

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "Login successful" ,
      token:token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= FORGOT PASSWORD ================= */
exports.forgetPassword = async (req, res) => {
  try {
    const { userEmail } = req.body;

    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.resetOtp = hashedOtp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    await sendEmail({
      email: userEmail,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Forget password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= VERIFY OTP ================= */
exports.verifyOtp = async (req, res) => {
  try {
    const { userEmail, otp } = req.body;

    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    if (
      user.resetOtp !== hashedOtp ||
      user.resetOtpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    // 🔐 IMPORTANT: OTP verified → invalidate it
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    user.resetPasswordAllowed = true;
    await user.save();

    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




exports.resetPassword = async (req, res) => {
  try {
    const { userEmail, newPassword,confirmPassword } = req.body;

    if (!userEmail || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if(newPassword !== confirmPassword){
      return res.status(400).json({
        message:"newpassword and confirm password doesn't match"
      })
    }

    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // OTP must already be verified
   if (!user.resetPasswordAllowed) {
  return res.status(400).json({
    message: "OTP verification required",
  });
}


    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.userPassword = hashedPassword;
    user.resetPasswordAllowed = false;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
    

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




/* ============== ADMIN LOGIN ============== */
exports.adminLogin = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;

    const admin = await User.findOne({ userEmail });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const isMatch = await bcrypt.compare(
      userPassword,
      admin.userPassword
    );

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("admintoken", token, { httpOnly: true });

    res.status(200).json({
      message: "Admin login successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};