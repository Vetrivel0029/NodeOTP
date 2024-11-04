const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const otpCache = {'email':'',"otp":0};

app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vetrivel290994@gmail.com',
      pass: 'zkes ygbo dwom mviy',
    },
  });
  let mailOptions = {
    from: 'no-reply@agm.com',
    to: 'vetri@mailinator.com',
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('OTP sent');
    
    otpCache['email'] = 'vetri@mailinator.com';
    otpCache['otp'] = otp;
  
    
  console.log(otpCache);

//   res.cookie('otpCache', otpCache, { maxAge: 3000, httpOnly: true }); 

  } catch (error) {
    res.status(500).send('Failed to send OTP');
  }
});


app.post('/verifyOTP', (req, res) => {
    const { email, otp } = req.body;
    console.log(`Verifying OTP for ${email}:`, otp);
    console.log(`Verifying OTP for ${otpCache}:`);
  
    if (otpCache.email === email && otpCache.otp === parseInt(otp)) {
      // Clear the cache after successful verification
    //   otpCache.email = '';
    //   otpCache.otp = 0;
      console.log("OTP verified");
      return res.status(200).json({ message: 'OTP verified' });
    } else {
      console.log("Invalid OTP");
      return res.status(400).json({ message: 'Invalid OTP' });
    }
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});