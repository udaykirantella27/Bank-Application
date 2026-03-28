'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, CheckCircle2, Clock, XCircle, IndianRupee, ArrowRight, Briefcase, TrendingUp, CreditCard, PiggyBank, Bell, Home, Car, GraduationCap, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { useRouter } from 'next/navigation';

interface LoanApplication {
  id: string;
  loan_amount: number;
  loan_purpose: string;
  employment_type: string;
  monthly_salary: number;
  term_months: number;
  status: string;
  created_at: string;
}

const purposeIcons: Record<string, typeof Home> = {
  home: Home, vehicle: Car, auto: Car, education: GraduationCap, personal: CreditCard, business: Briefcase,
};

const purposeColors: Record<string, string> = {
  home: '#3b82f6', vehicle: '#f59e0b', auto: '#f59e0b', education: '#8b5cf6', personal: '#ec4899', business: '#06b6d4',
};

export default function DashboardPage() {
  const [apps, setApps] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const fetchSessionAndLoans = async () => {
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError || !session) {
          // Fallback to login if non-authenticated
          router.push('/login');
          return;
        }

        setSession(session);

        const { data: loans, error: loansError } = await supabase
          .from('loan_applications')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (loansError) throw loansError;
        setApps(loans || []);
      } catch (err) {
        console.error('Failed to fetch user or loans', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndLoans();

    // Listen to real-time auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/login');
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const approved = apps.filter(a => a.status === 'approved');
  const pending = apps.filter(a => a.status === 'pending');
  const rejected = apps.filter(a => a.status === 'rejected');
  const totalAmount = approved.reduce((s, a) => s + Number(a.loan_amount), 0);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-500/10 text-amber-700 border-amber-200',
      approved: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
      rejected: 'bg-red-500/10 text-red-700 border-red-200',
    };
    return styles[status] || 'bg-slate-100 text-slate-700';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'approved') return <CheckCircle2 className="h-3.5 w-3.5" />;
    if (status === 'pending') return <Clock className="h-3.5 w-3.5" />;
    return <XCircle className="h-3.5 w-3.5" />;
  };

  const hasPendingLoans = pending.length > 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] px-4 sm:px-6 lg:px-8 py-4 relative overflow-hidden">

      {/* Decorative Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-[#00b074]/5 to-transparent pointer-events-none" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-[#00b074]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-6xl mx-auto fade-in relative z-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">{t('dash.myDashboard')}</h1>
            <p className="text-slate-500 text-base mt-2 font-medium">
              {t('dash.welcomeBack')} <span className="font-bold text-[#00b074]">{session?.user?.email || 'Customer'}</span>
            </p>
          </div>
          <Link
            href="/apply-loan"
            className="flex items-center gap-2 bg-[#0a2540] text-white px-7 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_4px_14px_0_rgba(0,176,116,0.39)] hover:shadow-[0_6px_20px_rgba(0,176,116,0.23)] hover:bg-[#00b074] hover:-translate-y-0.5 self-start sm:self-auto"
          >
            {t('dash.applyNew')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Document Upload Banner for Loans */}
        <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00b074] to-[#008f5d] text-white p-6 shadow-xl slide-up hover:shadow-2xl transition-all group cursor-default">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="bg-white/20 p-3.5 rounded-xl backdrop-blur-md border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                <UploadCloud className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1 tracking-tight">Action Required: Upload Documents</h3>
                <p className="text-emerald-50 text-sm font-medium leading-relaxed">
                  Upload documents to get faster verify and processing and approval.
                </p>
              </div>
            </div>
            <Link href="/dashboard/upload" className="whitespace-nowrap bg-white text-[#008f5d] px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-emerald-50 transition-colors flex items-center gap-2">
              <span>Upload File securely</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: t('dash.activeLoans'), value: approved.length, icon: CreditCard, color: '#10b981' },
                { label: t('dash.pending'), value: pending.length, icon: Clock, color: '#f59e0b' },
                { label: t('dash.totalApproved'), value: `₹${(totalAmount / 100000).toFixed(1)}L`, icon: IndianRupee, color: '#3b82f6' },
                { label: t('dash.applications'), value: apps.length, icon: FileText, color: '#8b5cf6' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-5 shadow-sm slide-up hover:-translate-y-1 hover:shadow-md transition-all" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 shadow-inner" style={{ backgroundColor: `${stat.color}15` }}>
                    <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                  </div>
                  <p className="text-2xl font-black text-slate-800 tracking-tight">{loading ? '—' : stat.value}</p>
                  <p className="text-[13px] text-slate-500 font-semibold mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Loan Applications */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/40 overflow-hidden slide-up" style={{ animationDelay: '200ms' }}>
              <div className="p-7 border-b border-slate-100 bg-white flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{t('dash.myLoans')}</h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">{t('dash.trackStatus')}</p>
                </div>
              </div>

              {loading ? (
                <div className="p-16 flex flex-col items-center justify-center text-slate-400 gap-4">
                  <div className="w-8 h-8 border-4 border-[#00b074] border-t-transparent rounded-full animate-spin" />
                  <span className="font-semibold text-sm animate-pulse">{t('dash.loadingApps')}</span>
                </div>
              ) : apps.length === 0 ? (
                <div className="p-16 text-center bg-slate-50/50">
                  <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                    <FileText className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-slate-800 font-bold text-lg">{t('dash.noLoansYet')}</p>
                  <p className="text-sm text-slate-500 mt-2 font-medium max-w-sm mx-auto">{t('dash.applyFirst')}</p>
                  <Link href="/apply-loan" className="inline-flex items-center justify-center gap-2 bg-[#00b074] text-white px-6 py-2.5 rounded-lg font-bold text-sm mt-6 hover:shadow-lg hover:shadow-[#00b074]/30 transition-all hover:-translate-y-0.5">
                    {t('dash.applyNow')} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {apps.map((app) => {
                    const PurposeIcon = purposeIcons[app.loan_purpose] || FileText;
                    const pColor = purposeColors[app.loan_purpose] || '#64748b';
                    return (
                      <div key={app.id} className="p-6 hover:bg-slate-50/80 transition-colors group cursor-default">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform" style={{ backgroundColor: `${pColor}12` }}>
                              <PurposeIcon className="h-6 w-6" style={{ color: pColor }} />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <p className="text-base font-bold text-slate-900 capitalize tracking-tight">{app.loan_purpose} {t('dash.loan')}</p>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border capitalize backdrop-blur-sm ${getStatusBadge(app.status)}`}>
                                  {getStatusIcon(app.status)}
                                  {app.status}
                                </span>
                              </div>
                              <p className="text-[13px] text-slate-500 font-medium flex items-center gap-2">
                                <span>{app.term_months} months term</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="capitalize">{app.employment_type?.replace('_', ' ')}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span>Applied {new Date(app.created_at).toLocaleDateString()}</span>
                              </p>
                            </div>
                          </div>
                          <div className="sm:text-right bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-xl">
                            <p className="text-xl font-black text-slate-900 flex items-center sm:justify-end tracking-tight">
                              <IndianRupee className="h-5 w-5 text-slate-400 mr-0.5" />
                              {Number(app.loan_amount).toLocaleString('en-IN')}
                            </p>
                            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Salary: ₹{Number(app.monthly_salary).toLocaleString('en-IN')}/mo</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Action Panel */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/40 p-6 slide-up" style={{ animationDelay: '300ms' }}>
              <h3 className="text-lg font-bold text-slate-900 mb-6">Explore Features</h3>
              <div className="space-y-3">
                {[
                  { label: t('dash.applyForLoan'), href: '/apply-loan', icon: Briefcase, color: '#00b074', desc: "Instant pre-approvals via AI" },
                  { label: "Check Risk Score", href: '/features/risk-scoring', icon: PiggyBank, color: '#8b5cf6', desc: "Generate your secure CIBIL alternative" },
                  { label: "ESG Analytics", href: '/features/esg-analytics', icon: TrendingUp, color: '#10b981', desc: "Go green with lower interest rates" },
                ].map((action, i) => (
                  <Link key={i} href={action.href} className="group flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#00b074]/30 hover:bg-[#00b074]/5 transition-all">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-50 group-hover:bg-white group-hover:scale-110 shadow-sm transition-all" style={{ color: action.color }}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-[#00b074] transition-colors">{action.label}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{action.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Notification Side Panel */}
            <div className="bg-[#0f172a] rounded-2xl shadow-xl p-6 text-white slide-up relative overflow-hidden" style={{ animationDelay: '400ms' }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-lg font-bold">Recent Updates</h3>
                </div>
                {apps.slice(0, 3).map((n) => (
                  <div key={n.id} className="mb-4 last:mb-0 border-l-2 border-indigo-500/50 pl-4 py-1">
                    <p className="text-sm font-medium text-slate-300">
                      Your <span className="text-white font-bold capitalize">{n.loan_purpose}</span> loan is currently{' '}
                      <span className={`font-bold uppercase tracking-wider text-[11px] px-2 py-0.5 rounded ml-1 ${n.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                          n.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                            'bg-amber-500/20 text-amber-400'
                        }`}>{n.status}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1.5">{new Date(n.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
                {apps.length === 0 && <p className="text-sm text-slate-400">No recent account updates.</p>}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
