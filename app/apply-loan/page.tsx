'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Landmark, ArrowRight, Loader2, Info, Banknote } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function ApplyLoan() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const router = useRouter();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    loanAmount: '',
    loanPurpose: '',
    employmentType: '',
    monthlySalary: '',
    termMonths: 12
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Notify tracking backend (non-blocking)
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/loans/apply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } catch (err) {
        // Silently catch fetch errors to avoid scaring the user with "Failed to fetch"
      }

      if (session) {
        // Logged in: Automatically apply
        const { error } = await supabase
          .from('loan_applications')
          .insert({
            user_id: session.user.id,
            loan_amount: Number(formData.loanAmount),
            loan_purpose: formData.loanPurpose,
            employment_type: formData.employmentType,
            monthly_salary: Number(formData.monthlySalary)
          });

        if (error) throw error;
        
        // Notify admin via email (fire-and-forget — don't block loan success)
        try {
          await fetch('/api/notify-admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              applicantEmail: session.user.email || 'Unknown',
              loanAmount: formData.loanAmount,
              loanPurpose: formData.loanPurpose,
              employmentType: formData.employmentType,
              termMonths: formData.termMonths,
            }),
          });
        } catch (notifyErr) {
          console.error('Admin notification failed (non-blocking):', notifyErr);
        }

        setMessage({
          type: 'success',
          text: t('loan.success')
        });

        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        // NOT LOGGED IN: Redirect to Register with a loan_followup track
        sessionStorage.setItem('pending_loan_application', JSON.stringify(formData));
        router.push('/login?mode=register&loan_followup=true');
        return; // Halt flow completely so no success message is shown
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while submitting.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      if (message?.type !== 'success') setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 pl-2 border-l-4 border-primary fade-in">
        <h1 className="text-3xl font-bold tracking-tight">{t('loan.title')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('loan.subtitle')}
        </p>
      </div>

      <div className="bg-card shadow-sm border border-border sm:rounded-2xl p-6 sm:p-10 slide-up">
        {message && (
          <div className={`mb-8 p-4 rounded-xl flex items-start gap-3 text-sm transition-all ${message.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            }`}>
            <Info className="h-5 w-5 shrink-0" />
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              {/* Financial Information Content */}
              <div>
                <h3 className="text-lg font-medium border-b border-border pb-2 mb-4 flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-primary" />
                  {t('loan.financialDetails')}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t('loan.amount')}
                    </label>
                    <input
                      type="number"
                      name="loanAmount"
                      required
                      min="100"
                      value={formData.loanAmount}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 border border-input rounded-xl bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                      placeholder="e.g. 50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t('loan.salary')}
                    </label>
                    <input
                      type="number"
                      name="monthlySalary"
                      required
                      min="0"
                      value={formData.monthlySalary}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 border border-input rounded-xl bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                      placeholder="e.g. 8000"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Employment and Purpose Information */}
              <div>
                <h3 className="text-lg font-medium border-b border-border pb-2 mb-4 flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-primary" />
                  {t('loan.loanSpecifics')}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t('loan.purpose')}
                    </label>
                    <select
                      name="loanPurpose"
                      required
                      value={formData.loanPurpose}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 border border-input rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                    >
                      <option value="" disabled>{t('loan.selectPurpose')}</option>
                      <option value="home">{t('loan.home')}</option>
                      <option value="auto">{t('loan.auto')}</option>
                      <option value="education">{t('loan.education')}</option>
                      <option value="personal">{t('loan.personal')}</option>
                      <option value="business">{t('loan.business')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t('loan.employment')}
                    </label>
                    <select
                      name="employmentType"
                      required
                      value={formData.employmentType}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 border border-input rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                    >
                      <option value="" disabled>{t('loan.selectEmployment')}</option>
                      <option value="full_time">{t('loan.fullTime')}</option>
                      <option value="part_time">{t('loan.partTime')}</option>
                      <option value="self_employed">{t('loan.selfEmployed')}</option>
                      <option value="contract">{t('loan.contractor')}</option>
                      <option value="unemployed">{t('loan.unemployed')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t('loan.term')}
                    </label>
                    <select
                      name="termMonths"
                      required
                      value={formData.termMonths}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 border border-input rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                    >
                      <option value="6">6 Months</option>
                      <option value="12">12 Months (1 Year)</option>
                      <option value="24">24 Months (2 Years)</option>
                      <option value="36">36 Months (3 Years)</option>
                      <option value="60">60 Months (5 Years)</option>
                      <option value="120">120 Months (10 Years)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex justify-center items-center gap-2 py-3 px-8 border border-transparent rounded-xl shadow-sm text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t('loan.submitting')}
                </>
              ) : (
                <>
                  {t('loan.submit')}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
