require('dotenv').config();
const express = require('express');
const { connectDB } = require('./Databases/dbconfig');
const User = require('./model/userModel');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
const PORT = process.env.PORT || 3000;
const bcrypt = require('bcryptjs');


app.post('/register', async (req, res) => {
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
});


app.post('/login', async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;

        const user = await User.findOne({ userEmail });
        if (!user) {
            return res.status(400).json({ message: 'email not found' });
        }

        const isPasswordValid = bcrypt.compareSync(userPassword, user.userPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', data: user });

    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});