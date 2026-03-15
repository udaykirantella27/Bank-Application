'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Landmark, ArrowRight, Loader2, Info } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Mock Auth Logic - Bypass Supabase Rules
      const role = email === 'uday39865@gmail.com' ? 'admin' : 'customer';
      
      // Store mock session securely in localStorage
      localStorage.setItem('bank_user_email', email);
      localStorage.setItem('bank_user_role', role);

      // Trigger a tiny visual delay so it feels authentic / allows state sync
      await new Promise(resolve => setTimeout(resolve, 600));

      // Redirect appropriately
      if (role === 'admin') {
        window.location.href = '/admin'; // Force full reload to ensure Layouts pick up localStorage
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-muted/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md fade-in">
        <div className="flex justify-center">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <Landmark className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground tracking-tight">
          Welcome to QuincyBlessy
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Enter your email to sign in or create an account instantly.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md slide-up">
        <div className="bg-card py-8 px-4 shadow-xl shadow-foreground/5 sm:rounded-2xl sm:px-10 border border-border">
          
          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
              message.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            }`}>
              <Info className="h-5 w-5 shrink-0" />
              <p>{message.text}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleAuth}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-input rounded-xl bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow sm:text-sm"
                  placeholder="uday39865@gmail.com"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
