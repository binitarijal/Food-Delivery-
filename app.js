require('dotenv').config();
const express = require('express');
const { connectDB } = require('./Databases/dbconfig');
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
const authRoutes = require('./routes/auth/authRoutes');
const PORT = process.env.PORT || 3000;


app.use('/', authRoutes);

app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});