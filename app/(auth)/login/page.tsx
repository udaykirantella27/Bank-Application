'use client';

import { useState, useEffect, Suspense } from 'react';
import { ArrowRight, Loader2, Info, Sparkles, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import BankLogo from '@/components/BankLogo';
import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isRegistering, setIsRegistering] = useState(searchParams.get('mode') === 'register');
  const [followupMsg, setFollowupMsg] = useState(searchParams.get('loan_followup') === 'true');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    // If the URL changes dynamically, we keep the states in sync
    setIsRegistering(searchParams.get('mode') === 'register');
    setFollowupMsg(searchParams.get('loan_followup') === 'true');
  }, [searchParams]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let authError;
      let sessionUser;

      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name || 'Customer' } }
        });
        authError = error;
        sessionUser = data.session?.user || data.user;
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        authError = error;
        sessionUser = data.session?.user;
      }

      if (authError) {
        throw new Error(authError.message);
      }

      if (!sessionUser) {
          throw new Error('Authentication failed. Please check your credentials.');
      }

      // Check if we have a pending loan application to submit now that they're registered
      const pendingStr = sessionStorage.getItem('pending_loan_application');
      if (pendingStr) {
        try {
          const pendingLoan = JSON.parse(pendingStr);
          const { error: loanError } = await supabase
            .from('loan_applications')
            .insert({
              user_id: sessionUser.id,
              loan_amount: Number(pendingLoan.loanAmount),
              loan_purpose: pendingLoan.loanPurpose,
              employment_type: pendingLoan.employmentType,
              monthly_salary: Number(pendingLoan.monthlySalary)
            });
            
          if (!loanError) {
             sessionStorage.removeItem('pending_loan_application');
          } else {
             console.error("Failed to insert pending loan after auth:", loanError);
          }
        } catch (e) {
          console.error("Failed to parse pending loan application", e);
        }
      }

      // Supabase role/policy checks are real, but we can store convenience role logic here if needed:
      if (email === 'uday39865@gmail.com') {
         // Optionally route admin somewhere special
         window.location.href = '/admin';
      } else {
         window.location.href = '/dashboard';
      }

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md fade-in">
        <div className="flex justify-center">
          <Link href="/">
             <BankLogo size={56} />
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black text-slate-900 tracking-tight">
          {isRegistering ? 'Create your Account' : t('login.welcome')}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Quantum Intelligent Banking — {t('login.subtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md slide-up">
        
        {followupMsg && isRegistering && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-4 rounded-xl flex items-start gap-3 shadow-[0_4px_14px_0_rgba(16,185,129,0.15)] animate-in fade-in slide-in-from-top-4 border-l-4 border-l-emerald-500">
             <Info className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
             <div className="text-[15px] font-bold tracking-tight">
               Register below to complete your loan application instantly.
             </div>
          </div>
        )}

        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-100 sm:rounded-2xl sm:px-10 border border-slate-100">

          <div className="flex rounded-xl bg-slate-100 p-1 mb-8">
            <button
              onClick={() => {
                setIsRegistering(false);
                setFollowupMsg(false); // Hide followup MSG if they flip back
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${!isRegistering ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </button>
            <button
              onClick={() => setIsRegistering(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${isRegistering ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <UserPlus className="h-4 w-4" />
              Register
            </button>
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm bg-red-50 text-red-600`}>
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleAuth}>
            
            {isRegistering && (
              <div className="fade-in">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    required={isRegistering}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00b074] focus:border-transparent transition-shadow sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t('login.email')}
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00b074] focus:border-transparent transition-shadow sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t('login.password')}
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00b074] focus:border-transparent transition-colors sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || !email || !password || (isRegistering && !name)}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-[0_4px_14px_0_rgba(0,176,116,0.25)] text-sm font-bold text-white bg-gradient-to-r from-[#00b074] to-[#008f5d] hover:shadow-[0_6px_20px_rgba(0,176,116,0.3)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b074] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {isRegistering ? 'Create Account' : t('login.continue')}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Sparkles className="h-3.5 w-3.5" />
            {t('login.aiSecurity')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 text-[#00b074] animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
