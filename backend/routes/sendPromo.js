const express = require('express');
const router = express.Router();

const nodemailer = require('nodemailer');

// Use environment variables for email authentication
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'uday39865@gmail.com',
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

router.post('/', async (req, res) => {
  try {
    const { email, phone, amount, message } = req.body;

    if (!email || !amount) {
      return res.status(400).json({ error: 'Email and Amount are required' });
    }

    const mailOptions = {
      from: '"QuincyBlessy Financial Services" <uday39865@gmail.com>',
      to: email,
      subject: `Your Approved Loan Offer: ₹${amount}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; background-color: #f9f9f9; color: #333;">
          <h2 style="color: #0f172a;">QuincyBlessy Financial Services</h2>
          <p>Congratulations!</p>
          <p>You are eligible for a personal loan up to <strong>₹${amount}</strong>.</p>
          <p style="font-style: italic; color: #555;">${message}</p>
          <div style="margin: 30px 0;">
            <a href="http://localhost:3000/apply-loan?offer=${amount}" style="background-color: #00b074; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Apply Instantly
            </a>
          </div>
          <p style="font-size: 12px; color: #888; border-top: 1px solid #ddd; padding-top: 10px;">
            QuincyBlessy Loan Platform<br>
            If you did not request this offer, you can safely ignore this email.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    // --- History Tracking ---
    const fs = require('fs');
    const path = require('path');
    const historyPath = path.join(__dirname, '../data/history.json');
    
    let history = [];
    if (fs.existsSync(historyPath)) {
      const data = fs.readFileSync(historyPath, 'utf8');
      if (data) history = JSON.parse(data);
    }
    
    // Add new record at the top of the array
    history.unshift({
      id: Date.now().toString(),
      email,
      phone: phone || 'N/A',
      amount,
      message,
      sentAt: new Date().toISOString(),
      status: 'Delivered'
    });
    
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
    // ------------------------

    res.json({ success: true, message: 'Promotions sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send promotional email' });
  }
});

module.exports = router;
