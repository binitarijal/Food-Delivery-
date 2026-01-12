const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../model/userModel');
const sendEmail = require('../../services/sendEmail');



exports.registerUser = async (req, res) => {
    try{
const { userEmail, userPhonenumber, userPassword, role } = req.body;
if(!userEmail || !userPhonenumber || !userPassword){
    return  res.status(400).json({ message: 'All fields are required' });
}
//check if user already exists
const existingUser = await User.findOne({ userEmail: userEmail });
if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
}

const hashedPassword =  bcrypt.hashSync(userPassword, 10);
const response = await User.create({ userEmail,
     userPhonenumber,
      userPassword: hashedPassword,
       role });
if (response) {
    res.status(201).json({ 
        message: 'User registered successfully', 
        data: response 
    });  
} else {
    res.status(400).json({ message: 'User registration failed' });
}
    }catch(error){
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.loginUser = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;

        const user = await User.findOne({ userEmail });
        if (!user) {
            return res.status(400).json({ message: 'email not found' });
        }


        const isPasswordValid = bcrypt.compareSync(userPassword, user.userPassword);
        if(isPasswordValid){
const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
res.cookie('token', token, { httpOnly: true });

        }
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', data: user });

    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.forgetPassword = async (req, res) => {
    const { userEmail } = req.body;
    if(!userEmail){
        return res.status(400).json({ message: 'Email is required' });
    }
    // Implementation for forget password functionality
    const user = await User.findOne({ userEmail });
    if (!user) {
        return res.status(400).json({ message: 'Email not found' });
    }



    // Further steps like sending reset link can be implemented here otp etc.

    const otp=Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    console.log(`OTP for password reset is: ${otp}`);
    res.status(200).json({ message: 'OTP sent to email',
          otp: otp });
         await sendEmail({
            email: userEmail,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`
        });
    
res.json({
    message:"email send success"
})
}