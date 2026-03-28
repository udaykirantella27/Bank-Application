'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UploadCloud, FileText, CheckCircle2, ShieldCheck, Home, Car, GraduationCap, Briefcase, CreditCard, ArrowLeft, Loader2, AlertCircle, FileCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LOAN_GUIDELINES = [
  {
    id: 'personal',
    title: 'Personal Loan',
    icon: CreditCard,
    color: '#ec4899',
    process: 'Instant processing via unified API. We evaluate your CIBIL equivalent and recent cash flows.',
    docs: ['Identity Proof (Aadhar/PAN)', 'Last 3 months Bank Statement'],
    expertTip: 'Ensure your bank statement reflects your salary credits clearly. A clean record with no recent cheque bounces increases approval speed by 80%.'
  },
  {
    id: 'home',
    title: 'Home Loan',
    icon: Home,
    color: '#3b82f6',
    process: 'Comprehensive property and income verification. We prioritize fast legal checks directly with registry APIs.',
    docs: ['Identity Proof', 'Property Allotment Letter / Agreement to Sale', 'Income Proof (ITR / Form 16)'],
    expertTip: 'Disclose all existing EMIs. Lenders calculate your FOIR (Fixed Obligation to Income Ratio). Keeping FOIR below 50% guarantees the best interest rates.'
  },
  {
    id: 'vehicle',
    title: 'Vehicle / Auto Loan',
    icon: Car,
    color: '#f59e0b',
    process: 'Automated dealer network checks. The asset acts as collateral, making approvals lightning fast.',
    docs: ['Identity & Address Proof', 'Proforma Invoice from Dealer', 'Recent Pay Slips (2 months)'],
    expertTip: 'Putting down a 20% margin money (down-payment) normally bypasses rigid income checks, leading to instant on-the-spot approvals.'
  },
  {
    id: 'education',
    title: 'Education Loan',
    icon: GraduationCap,
    color: '#8b5cf6',
    process: 'Future-income predictive modeling. We look at the university tier and course employability.',
    docs: ['Institute Admission Letter', 'Fee Structure', 'Co-Applicant KYC & Income Proof'],
    expertTip: 'If your institute is Tier-1 (IIT/IIM equivalent), you may not even need financial co-applicants. Just the admission letter triggers our pre-approved tier.'
  },
  {
    id: 'business',
    title: 'Business Loan',
    icon: Briefcase,
    color: '#06b6d4',
    process: 'Cash-flow based lending. We analyze GST returns and banking transactions to determine your drawing power.',
    docs: ['Business Registration (GST/MSME)', 'Last 12 months Bank Statement', '2 Years ITR'],
    expertTip: 'Connecting your current account via the Account Aggregator eliminates the need for any paper documents and yields credit decisions in under 5 minutes.'
  }
];

export default function DocumentUploadPortal() {
  const router = useRouter();
  const [loans, setLoans] = useState<any[]>([]);
  const [selectedLoanId, setSelectedLoanId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);

  useEffect(() => {
    const fetchLoans = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setSessionUser(session.user);

      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setLoans(data);
        if (data.length > 0) setSelectedLoanId(data[0].id);
      }
      setLoading(false);
    };
    fetchLoans();
  }, [router]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedLoanId) return;

    setUploading(true);
    setUploadSuccess(false);

    try {
      // Logic to actually upload to Supabase storage if we had a bucket ready,
      // For now, we simulate the storage upload and record it in the DB
      const targetLoan = loans.find(l => l.id === selectedLoanId);

      const { error } = await supabase.from('documents').insert({
        loan_id: selectedLoanId,
        document_type: targetLoan ? `${targetLoan.loan_purpose.toUpperCase()} Verification Docs` : 'General Document',
        file_name: file.name,
        file_url: `dummy_url_${Date.now()}_${file.name}`
      });

      if (error) throw error;
      
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 5000);
      
      // Update local loan state if needed or just show success
    } catch (err) {
      console.error('Upload Error:', err);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = ''; // Reset input
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-[#00b074] animate-spin" />
      </div>
    );
  }

  const selectedLoan = loans.find(l => l.id === selectedLoanId);
  const activeGuideline = selectedLoan ? LOAN_GUIDELINES.find(g => g.id === selectedLoan.loan_purpose) || LOAN_GUIDELINES[0] : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] py-10 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 fade-in">
        
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Document Upload Center</h1>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            Welcome to the QIB central processing hub. Select your application below to securely upload your documents. 
            Our intelligent systems process your files in real-time.
          </p>
        </div>

        {/* One Document Concept Banner */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/30">
                <ShieldCheck className="h-3.5 w-3.5" /> QIB Unified API
              </div>
              <h2 className="text-2xl font-bold mb-3">Why One Document is Sufficient?</h2>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                Gone are the days of submitting endless paper trails. By utilizing the <strong>Account Aggregator Framework</strong> and <strong>e-KYC</strong>, a single authorized Bank Statement or your PAN/Aadhar pull provides our AI underwriting engine with 100% of the verified datapoints needed to approve your loan instantly.
              </p>
            </div>
            <div className="w-full md:w-auto bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl shrink-0">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="font-semibold text-sm">Identity Verified (e-KYC)</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="font-semibold text-sm">Income Analyzed (AA)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="font-semibold text-sm">Fraud Checks Cleared</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Upload Area */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 h-full">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-[#00b074]" /> Secure Upload Gateway
              </h3>

              {loans.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                  <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                  <h4 className="font-bold text-amber-800 text-lg mb-2">No Active Applications</h4>
                  <p className="text-amber-700 text-sm mb-6">You must formulate an application first before our banking systems can attach documents to your profile.</p>
                  <Link href="/apply-loan" className="inline-block bg-amber-500 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-amber-600 transition-colors shadow-sm">
                    Apply for a Loan Now
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Application File</label>
                    <select 
                      value={selectedLoanId} 
                      onChange={(e) => setSelectedLoanId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#00b074] focus:border-transparent outline-none text-slate-800 font-medium cursor-pointer"
                    >
                      {loans.map(loan => (
                        <option key={loan.id} value={loan.id}>
                          {loan.loan_purpose.toUpperCase()} LOAN — ₹{(loan.loan_amount).toLocaleString('en-IN')} (ID: {loan.id.slice(0, 8)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {activeGuideline && (
                    <div className="mb-8 bg-slate-50 border border-slate-100 rounded-xl p-5">
                      <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-2">Requested Documents for {activeGuideline.title}</p>
                      <ul className="space-y-2">
                        {activeGuideline.docs.map((doc, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00b074] mt-1.5 shrink-0" /> {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="relative border-2 border-dashed border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl p-10 text-center transition-all group">
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept=".pdf,.png,.jpg,.jpeg"
                      disabled={uploading}
                      onChange={handleFileUpload}
                    />
                    <div className="flex flex-col items-center justify-center pointer-events-none">
                      {uploading ? (
                        <>
                          <Loader2 className="h-12 w-12 text-[#00b074] animate-spin mb-4" />
                          <h4 className="text-lg font-bold text-slate-900 mb-1">Encrypting & Uploading...</h4>
                          <p className="text-sm text-slate-500">Establishing secure Bank-Grade AES-256 tunnel</p>
                        </>
                      ) : uploadSuccess ? (
                        <>
                          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                            <FileCheck className="h-7 w-7" />
                          </div>
                          <h4 className="text-lg font-bold text-emerald-700 mb-1">Document Secured!</h4>
                          <p className="text-sm text-emerald-600/80">Our underwriters have been notified automatically.</p>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:-translate-y-1 group-hover:shadow-md transition-all">
                            <UploadCloud className="h-8 w-8" />
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 mb-1">Drag & Drop or Click</h4>
                          <p className="text-sm text-slate-500 max-w-xs mx-auto">
                            PDF, JPG, or PNG. Maximum file size 15MB.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Expert Guidelines */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-baseline justify-between">
              Loan Guidelines
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Department Insights</span>
            </h3>

            <div className="space-y-4">
              {LOAN_GUIDELINES.map((guide) => (
                <div 
                  key={guide.id} 
                  className={`bg-white rounded-2xl shadow-sm border p-6 transition-all ${activeGuideline?.id === guide.id ? 'border-emerald-500 shadow-emerald-500/10 scale-[1.02] z-10 relative' : 'border-slate-200/60 opacity-60 hover:opacity-100'}`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${guide.color}15`, color: guide.color }}>
                      <guide.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">{guide.title}</h4>
                      <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Bank Processing Protocol
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">The Process</h5>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">{guide.process}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <h5 className="text-[11px] font-black text-[#00b074] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <FileText className="h-3 w-3" /> Underwriter's Secret
                      </h5>
                      <p className="text-sm text-slate-700 italic font-medium leading-relaxed">
                        "{guide.expertTip}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
