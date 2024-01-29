import { User} from "../models/user.model.js"
import mongoose from "mongoose";
import qrcode from "qrcode"
import fs from "fs"
import { QRcode } from "../models/qrcode.model.js";
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import nodemailer from "nodemailer"
import smtpTransport from 'nodemailer-smtp-transport'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const registerUser=async (req,res)=>{
    try {
        const {
          fullName,
          email,
          picturePath
        } = req.body;

        //qrcode generating
        const text = 'Name: ' + fullName+ '\nemail: ' + email;
        const fileName = path.join(__dirname, 'qrcode.png');

        qrcode.toFile(fileName, text, { width: 200, height: 200 }, (err) => {
            if (err) {
              console.error('Error generating QR code:', err);
            } else {
              console.log(`QR code saved to ${fileName}`);
            }
        });

        const qrCodeBuffer = fs.readFileSync(fileName);

        console.log("qr file readed")

        const newQRCode = await QRcode.create({ data: qrCodeBuffer });

        const newUser = new User({
          fullName,
          email,
          picturePath:newQRCode?._id 
        });

        

        const savedUser = await newUser.save();

        await sendEmail(fileName,email)

        res.status(201).json(savedUser);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}



// Function to send email
const sendEmail=async(filepath,email) =>{
    // Set up nodemailer transporter
    const testAccount=await nodemailer.createTestAccount()

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'shaina18@ethereal.email',
            pass: 'GjhyndGmg8fb7qCedp'
        }
    });
  
    // Email configuration
    const mailOptions = {
      from: '"ayush 👻" <ayush@gmail.com>',
      to: email, // Replace with the recipient's email address
      subject: 'QR Code',
      text: 'Attached is the QR code file.',
      attachments: [
        {
          filename: "qrcode.png",
          path: `${filepath}`, // Update the path if the file is in a different directory
          cid: 'qrcode-image',
        },
      ],
    };
  
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }

export  {registerUser}