import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const loanTypeLabels: Record<string, string> = {
  home: 'Home Loan',
  vehicle: 'Vehicle Loan',
  education: 'Education Loan',
  personal: 'Personal Loan',
  business: 'Business Loan',
};

export async function POST(req: Request) {
  try {
    const { email, phone, amount, message, loanType, promoLink } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const loanLabel = loanTypeLabels[loanType] || 'Loan';
    const applyLink = promoLink || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/apply-loan?ref=promo&type=${loanType}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'uday39865@gmail.com',
        pass: process.env.EMAIL_APP_PASSWORD || 'yayj bhit goon kcax',
      }
    });

    const mailOptions = {
      from: '"QIB — Quantum Intelligent Banking" <uday39865@gmail.com>',
      to: email,
      subject: `🎉 Exclusive ${loanLabel} Offer${amount ? `: Up to ₹${Number(amount).toLocaleString('en-IN')}` : ''} — QIB`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
          <div style="background: linear-gradient(135deg, #00b074, #008f5d); padding: 32px 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 800;">QIB Banking</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 13px;">Quantum Intelligent Banking</p>
          </div>
          <div style="padding: 32px 24px;">
            <p style="color: #334155; font-size: 15px; margin: 0 0 16px;">Dear Valued Customer,</p>
            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
              Great news! You've been <strong style="color: #00b074;">pre-approved</strong> for a 
              <strong style="color: #0f172a;">${loanLabel}</strong>${amount ? ` of up to <strong style="color: #00b074;">₹${Number(amount).toLocaleString('en-IN')}</strong>` : ''} 
              with competitive interest rates.
            </p>
            ${message ? `<p style="color: #64748b; font-size: 14px; border-left: 3px solid #00b074; padding-left: 12px; margin: 16px 0; font-style: italic;">${message}</p>` : ''}
            <div style="text-align: center; margin: 32px 0;">
              <a href="${applyLink}" style="background: linear-gradient(135deg, #00b074, #008f5d); color: white; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 15px; display: inline-block;">
                Apply Now →
              </a>
            </div>
            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 24px 0 0;">
              Terms & conditions apply. Subject to eligibility verification.<br>
              This is a limited-time offer from QIB Banking.
            </p>
          </div>
          <div style="background: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">
              QIB — Quantum Intelligent Banking · Enterprise Platform<br>
              If you did not request this offer, you can safely ignore this email.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    // Use /tmp for Vercel's read-only filesystem
    const historyPath = process.env.VERCEL ? '/tmp/history.json' : path.join(process.cwd(), 'data', 'history.json');
    let history: unknown[] = [];
    if (fs.existsSync(historyPath)) {
      const data = fs.readFileSync(historyPath, 'utf8');
      if (data) history = JSON.parse(data);
    }
    history.unshift({
      id: Date.now().toString(),
      email,
      phone: phone || 'N/A',
      amount: amount || '0',
      loanType: loanLabel,
      message: message || '',
      sentAt: new Date().toISOString(),
      status: 'Delivered'
    });

    const dir = path.dirname(historyPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));

    return NextResponse.json({ success: true, message: 'Promotional offer sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send promotional email' }, { status: 500 });
  }
}
