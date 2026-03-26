import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { applicantEmail, loanAmount, loanPurpose, employmentType, termMonths } = await req.json();

        if (!applicantEmail || !loanAmount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const purposeLabels: Record<string, string> = {
            home: 'Home Loan', auto: 'Vehicle Loan', vehicle: 'Vehicle Loan',
            education: 'Education Loan', personal: 'Personal Loan', business: 'Business Loan',
        };
        const loanLabel = purposeLabels[loanPurpose] || 'Loan';
        const formattedAmount = Number(loanAmount).toLocaleString('en-IN');

        // Send email to admin
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'uday39865@gmail.com',
                pass: process.env.EMAIL_APP_PASSWORD || 'yayj bhit goon kcax',
            }
        });

        const adminEmail = 'uday39865@gmail.com';

        const mailOptions = {
            from: '"QIB Banking — Alert System" <uday39865@gmail.com>',
            to: adminEmail,
            subject: `🔔 New ${loanLabel} Application — ₹${formattedAmount}`,
            html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
          <div style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 24px; text-align: center;">
            <h1 style="color: #f1f5f9; margin: 0; font-size: 20px; font-weight: 800;">🔔 New Loan Application</h1>
            <p style="color: #94a3b8; margin: 4px 0 0; font-size: 12px;">QIB Admin Notification System</p>
          </div>
          <div style="padding: 24px;">
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
              <p style="margin: 0 0 4px; font-size: 13px; color: #64748b;">Application Amount</p>
              <p style="margin: 0; font-size: 28px; font-weight: 900; color: #00b074;">₹${formattedAmount}</p>
            </div>
            <table style="width: 100%; font-size: 14px; color: #334155; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #94a3b8; width: 140px;">Applicant Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600;">${applicantEmail}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #94a3b8;">Loan Type</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600;">${loanLabel}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #94a3b8;">Employment</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; text-transform: capitalize;">${(employmentType || '').replace('_', ' ')}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #94a3b8;">Term</td>
                <td style="padding: 10px 0; font-weight: 600;">${termMonths || 12} months</td>
              </tr>
            </table>
            <div style="text-align: center; margin: 24px 0 8px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/applications" style="background: linear-gradient(135deg, #00b074, #008f5d); color: white; padding: 12px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block;">
                Review Application →
              </a>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 12px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">QIB Admin Alert System · Quantum Intelligent Banking</p>
          </div>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Admin notification email sent for ${loanLabel} application: ₹${formattedAmount}`);

        return NextResponse.json({ success: true, message: 'Admin notified via email' });
    } catch (error) {
        console.error('Failed to send admin notification:', error);
        // Don't fail the loan application if email fails
        return NextResponse.json({ success: false, message: 'Email notification failed but application was saved' });
    }
}
