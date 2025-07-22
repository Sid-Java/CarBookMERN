// utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();          // so .env is available here

// === 1️⃣ transporter  ====================================================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
// === 2️⃣ helper function  ================================================
const sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"A&S Car Booking Service" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

module.exports = sendMail;
