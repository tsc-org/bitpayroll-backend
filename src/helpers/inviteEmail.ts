const nodemailer = require("nodemailer");
import { config } from "../config/config";

//creating nodemailer transporter for sending confirmation link mail
export const inviteEmail = async (
  secretToken: string,
  employeeAddress: string
) => {
  let transporter = nodemailer.createTransport({
    service: "gmail", // using gmail as mail service for testing
    auth: {
      user: config.email,
      pass: config.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const confirmURL = `bitpayroll.vercel.app/${secretToken}`;
  // setup email data with unicode symbols
  const mailOptions = {
    from: process.env.EMAIL,
    to: employeeAddress,
    subject: "Confirm your account",
    html: `<div style="width: 100%; height: 100%; background-color: #f2f2f2; padding: 20px;">
    <div style="width: 100%; max-width: 600px; margin: auto; background-color: white; padding: 20px;">
      <div style="width: 100%; text-align: center;">
        <h1 style="font-size: 30px; color: #1e90ff;">Welcome to the team!</h1>
        <p style="font-size: 20px; color: #1e90ff;">Please confirm your email address to complete your registration.</p>
      </div>  
      <div style="width: 100%; text-align: center;">

        <a href="${confirmURL}" style="text-decoration: none; background-color: #1e90ff; color: white; padding: 10px 20px; border-radius: 5px; font-size: 20px;">Confirm</a>
      </div>
    </div>
  </div>`,
  };

  await transporter.sendMail(mailOptions);
};
