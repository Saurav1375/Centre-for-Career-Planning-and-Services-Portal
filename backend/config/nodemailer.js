import dotenv from "dotenv";
dotenv.config({});

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    ignoreTLS: true
});

transporter.verify(function (error, success) {
    if (error) {
        console.error("SMTP connection failed:", error);
    } else {
        console.log("SMTP server is ready to take our messages");
    }
});


export default transporter;