'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Landmark, ArrowRight, Loader2, Info, Banknote } from 'lucide-react';

export default function ApplyLoan() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const router = useRouter();

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
      
      if (!session) {
        throw new Error('You must be logged in to apply for a loan.');
      }

      try {
        await fetch('/api/loans/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } catch (err) {
        console.error('Backend Express ping failed', err);
      }

      const { error } = await supabase
        .from('loan_applications')
        .insert({
          user_id: session.user.id,
          loan_amount: Number(formData.loanAmount),
          loan_purpose: formData.loanPurpose,
          employment_type: formData.employmentType,
          monthly_salary: Number(formData.monthlySalary),
          term_months: Number(formData.termMonths)
        });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Loan application submitted successfully! Redirecting to dashboard...'
      });

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

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
        <h1 className="text-3xl font-bold tracking-tight">Apply for a Loan</h1>
        <p className="text-muted-foreground mt-2">
          Fill out the secure form below to apply for your new loan. 
          We&apos;ll process it and get back to you shortly.
        </p>
      </div>

      <div className="bg-card shadow-sm border border-border sm:rounded-2xl p-6 sm:p-10 slide-up">
        {message && (
          <div className={`mb-8 p-4 rounded-xl flex items-start gap-3 text-sm transition-all ${
            message.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
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
                  Financial Details
                </h3>
                  
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Requested Loan Amount ($)
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
                      Monthly Salary ($)
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
                  Loan Specifics
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Loan Purpose
                    </label>
                    <select
                      name="loanPurpose"
                      required
                      value={formData.loanPurpose}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 border border-input rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                    >
                      <option value="" disabled>Select a purpose</option>
                      <option value="home">Home Purchase / Renovation</option>
                      <option value="auto">Auto / Vehicles</option>
                      <option value="education">Education</option>
                      <option value="personal">Personal / Medical</option>
                      <option value="business">Business</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Employment Type
                    </label>
                    <select
                      name="employmentType"
                      required
                      value={formData.employmentType}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 border border-input rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                    >
                      <option value="" disabled>Select employment type</option>
                      <option value="full_time">Full-Time Employed</option>
                      <option value="part_time">Part-Time Employed</option>
                      <option value="self_employed">Self-Employed / Business Owner</option>
                      <option value="contract">Contractor</option>
                      <option value="unemployed">Unemployed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Term (Months)
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
                  Submitting Application...
                </>
              ) : (
                <>
                  Submit Application
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
