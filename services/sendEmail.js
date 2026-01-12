const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport

const sendEmail = async (options) => {
const transporter = nodemailer.createTransport({
    
service: 'Gmail',
    auth:{
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
}
    })


const mailOptions = {
    from: "Momo center <momo@gmail.com>",
    to: options.email, // will be set dynamically
    subject: options.subject, // will be set dynamically
    text: options.text // will be set dynamically
}


await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;