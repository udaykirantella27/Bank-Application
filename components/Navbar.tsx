'use client';

import Link from 'next/link';
import { LogOut, ShieldCheck, LayoutDashboard, Menu, X, Home, CreditCard, Headphones } from 'lucide-react';
import { useState, useEffect } from 'react';
import BankLogo from '@/components/BankLogo';
import { useLanguage } from '@/lib/i18n';

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const storedEmail = localStorage.getItem('bank_user_email');
    const storedRole = localStorage.getItem('bank_user_role');
    if (storedEmail) setEmail(storedEmail);
    if (storedRole) setRole(storedRole);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSignOut = () => {
    localStorage.removeItem('bank_user_email');
    localStorage.removeItem('bank_user_role');
    window.location.href = '/login';
  };

  const isAdmin = role === 'admin';

  const navLinks = [
    ...(email
      ? isAdmin
        ? [{ href: '/admin', label: t('nav.adminPanel'), icon: ShieldCheck, iconColor: 'text-violet-500' }]
        : [{ href: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard, iconColor: 'text-emerald-500' }]
      : []),
    { href: '/offer', label: t('nav.loanProducts'), icon: CreditCard, iconColor: 'text-blue-500' },
    { href: '/#services', label: t('nav.services'), icon: Home, iconColor: 'text-amber-500' },
    { href: '/#contact', label: t('nav.support'), icon: Headphones, iconColor: 'text-pink-500' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <BankLogo size={38} />
              <span className="font-black text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#00b074] to-[#008f5d]">
                QIB
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    <Icon className={`h-3.5 w-3.5 ${link.iconColor}`} />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {email ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
                    {isAdmin && <ShieldCheck className="h-3.5 w-3.5 text-violet-500" />}
                    <span className="text-sm font-medium text-slate-700 max-w-[140px] truncate">{email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:block bg-gradient-to-r from-[#00b074] to-[#008f5d] text-white hover:shadow-lg hover:shadow-emerald-200 px-5 py-2 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5"
                >
                  {t('nav.signIn')}
                </Link>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm mobile-drawer-backdrop"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-[340px] bg-white shadow-2xl mobile-drawer-slide flex flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BankLogo size={32} animated={false} />
                <span className="font-black text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#00b074] to-[#008f5d]">QIB</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User Info (Mobile) */}
            {email && (
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00b074] to-[#06b6d4] flex items-center justify-center text-white font-bold text-sm">
                    {email[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{email}</p>
                    <p className="text-xs text-slate-500">{isAdmin ? '🛡 Admin' : '👤 Customer'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-all active:scale-[0.98]"
                  >
                    <div className={`w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center`}>
                      <Icon className={`h-4.5 w-4.5 ${link.iconColor}`} />
                    </div>
                    <span className="text-[15px]">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 space-y-3">
              {email ? (
                <button
                  onClick={() => { handleSignOut(); setMobileOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  {t('nav.logout')}
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#00b074] to-[#008f5d] text-white font-semibold text-sm hover:shadow-lg transition-all"
                >
                  {t('nav.signIn')}
                </Link>
              )}
              <p className="text-[10px] text-center text-slate-400">QIB — Quantum Intelligent Banking © 2026</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
