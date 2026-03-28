import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req: Request) {
    try {
        const { 
            applicationId, 
            employeeEmail, 
            employeeName, 
            customerName, 
            loanType, 
            loanAmount, 
            monthlySalary,
            employmentType,
            documents: checklistDocs 
        } = await req.json();

        if (!employeeEmail || !customerName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const formattedAmount = Number(loanAmount).toLocaleString('en-IN');
        const formattedSalary = Number(monthlySalary).toLocaleString('en-IN');

        // 1. Fetch actual uploaded documents for this application
        let uploadedDocs: any[] = [];
        if (applicationId) {
            const { data } = await supabase
                .from('documents')
                .select('*')
                .eq('loan_id', applicationId);
            uploadedDocs = data || [];
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'uday39865@gmail.com',
                pass: process.env.EMAIL_APP_PASSWORD || 'yayj bhit goon kcax',
            }
        });

        const mailOptions = {
            from: '"QIB Banking — Official Dispatch" <uday39865@gmail.com>',
            to: employeeEmail,
            subject: `🚀 [ACTION REQUIRED] Digital Loan Package: ${customerName}`,
            html: `
        <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);">
          
          <!-- Premium Header -->
          <div style="background: #0f172a; padding: 40px 30px; text-align: center;">
            <div style="display: inline-block; background: #00b074; color: white; padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 15px;">Official Dispatch</div>
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.02em;">Digital Loan Application Package</h1>
            <p style="color: #94a3b8; margin: 8px 0 0; font-size: 14px;">Reference ID: ${applicationId?.substring(0, 8).toUpperCase() || 'N/A'}</p>
          </div>

          <div style="padding: 35px;">
            <p style="font-size: 16px; color: #1e293b; margin-bottom: 25px; line-height: 1.5;">Hello <strong>${employeeName || 'Loan Officer'}</strong>,</p>
            <p style="font-size: 15px; color: #475569; margin-bottom: 30px; line-height: 1.6;">
              Please find the complete digital dossier for <strong>${customerName}</strong>. This package contains the verified applicant profile and all required document links for immediate appraisal.
            </p>
            
            <!-- Applicant Intelligence Card -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 25px; margin-bottom: 30px;">
              <h3 style="margin: 0 0 15px; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 800;">Applicant Core Data</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                 <div style="margin-bottom: 12px;">
                    <p style="margin: 0; font-size: 11px; color: #94a3b8; text-transform: uppercase;">Loan Requirement</p>
                    <p style="margin: 4px 0 0; font-size: 16px; font-weight: 700; color: #1e293b;">₹${formattedAmount} (${loanType})</p>
                 </div>
                 <div style="margin-bottom: 12px;">
                    <p style="margin: 0; font-size: 11px; color: #94a3b8; text-transform: uppercase;">Employment</p>
                    <p style="margin: 4px 0 0; font-size: 15px; font-weight: 600; color: #1e293b; text-transform: capitalize;">${employmentType}</p>
                 </div>
                 <div style="margin-bottom: 0;">
                    <p style="margin: 0; font-size: 11px; color: #94a3b8; text-transform: uppercase;">Monthly Income</p>
                    <p style="margin: 4px 0 0; font-size: 15px; font-weight: 600; color: #00b074;">₹${formattedSalary}</p>
                 </div>
              </div>
            </div>

            <!-- Digital Document Vault -->
            <div style="margin-bottom: 35px;">
              <h3 style="margin: 0 0 15px; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 800;">Document Vault</h3>
              
              ${uploadedDocs.length > 0 ? `
                <div style="border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                  ${uploadedDocs.map(doc => `
                    <div style="padding: 15px 20px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; background: #ffffff;">
                      <div style="display: flex; align-items: center;">
                        <span style="background: #f1f5f9; color: #64748b; width: 32px; height: 32px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; margin-right: 12px;">📄</span>
                        <div>
                          <p style="margin: 0; font-size: 14px; font-weight: 600; color: #1e293b;">${doc.document_type || doc.file_name}</p>
                          <p style="margin: 2px 0 0; font-size: 11px; color: #94a3b8;">Uploaded on ${new Date(doc.uploaded_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <a href="${doc.file_url}" style="color: #4f46e5; font-size: 13px; font-weight: 700; text-decoration: none; border: 1px solid #e2e8f0; padding: 6px 14px; border-radius: 8px; hover:background: #f8fafc;">Open File →</a>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 16px; padding: 20px; text-align: center;">
                  <p style="margin: 0; font-size: 13px; color: #92400e; font-weight: 500;">No manual uploads found. Please refer to the required checklist below for manual collection.</p>
                </div>
              `}

              <div style="margin-top: 15px; background: #fdfdfd; border: 1px dashed #e2e8f0; border-radius: 12px; padding: 15px;">
                <p style="margin: 0 0 8px; font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Standard Checklist for ${loanType}</p>
                <div style="font-size: 12px; color: #64748b; line-height: 1.5;">
                  ${(checklistDocs || []).join(' • ')}
                </div>
              </div>
            </div>

            <!-- Standalone Footer Note -->
            <div style="border-top: 1px solid #f1f5f9; pt: 25px; margin-top: 10px;">
              <p style="font-size: 14px; color: #475569; margin-bottom: 20px; font-style: italic;">
                "Thank you for partnering with QIB. We look forward to your speedy processing and follow-up on this application."
              </p>
              <p style="font-size: 13px; color: #94a3b8; margin-top: 20px;">
                Sincerely,<br/>
                <strong>QIB Operations Team</strong>
              </p>
            </div>
          </div>

          <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">This is a system-generated secure dispatch from QIB Advanced Agentic Banking Platform. Private & Confidential.</p>
          </div>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Enterprise Loan package dispatched for ${customerName} to ${employeeEmail}`);

        return NextResponse.json({ success: true, message: 'Full standalone package dispatched successfully via email' });
    } catch (error: any) {
        console.error('Failed to dispatch package:', error);
        return NextResponse.json({ success: false, message: `Email dispatch failed: ${error.message}` }, { status: 500 });
    }
}
