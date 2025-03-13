const express = require('express');
const router = express.Router()
const nodemailer = require('nodemailer');

router.route('/').post((req,res)=>{
    const { name, email, number, message } = req.body;

    require('dotenv').config();

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EAMIL_PASS
        }
      });

      var mailOptions = {
        from: process.env.EMAIL_USER, 
        to: process.env.EMAIL_TO_USER, 
        subject: `Contact Details ${name}`,
        html: `<h1>Contact Details</h1>
           <p> I am reaching out to contact on the availability of rental space</p>
           <p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Number:</strong> ${number}</p>
           <p><strong>Message:</strong> ${message}</p>`
    };
    
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error', message: 'Email not sent' });
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).json({ status: 'success', message: 'Email sent successfully' });
        }
      });
})
module.exports = router