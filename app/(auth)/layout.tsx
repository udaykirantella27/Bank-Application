// Auth pages (login/register) get their own layout WITHOUT the global Navbar.
// This prevents the sticky navbar from blocking the auth forms.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {children}
    </div>
  );
}
