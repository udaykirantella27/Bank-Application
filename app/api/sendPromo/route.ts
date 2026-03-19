import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { email, phone, amount, message } = await req.json();

    if (!email || !amount) {
      return NextResponse.json({ error: 'Email and Amount are required' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'uday39865@gmail.com',
        pass: process.env.EMAIL_APP_PASSWORD,
      }
    });

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
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/apply-loan?offer=${amount}" style="background-color: #00b074; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
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

    const historyPath = path.join(process.cwd(), 'data', 'history.json');
    let history: any[] = [];
    if (fs.existsSync(historyPath)) {
      const data = fs.readFileSync(historyPath, 'utf8');
      if (data) history = JSON.parse(data);
    }
    history.unshift({
      id: Date.now().toString(),
      email,
      phone: phone || 'N/A',
      amount,
      message,
      sentAt: new Date().toISOString(),
      status: 'Delivered'
    });
    
    const dir = path.dirname(historyPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));

    return NextResponse.json({ success: true, message: 'Promotions sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send promotional email' }, { status: 500 });
  }
}
