'use client';

import { ShieldCheck, Activity, Megaphone, FileText, Users, Link as LinkIcon, Brain, Zap, Globe, Leaf, Send, BarChart3, Headphones, BellRing, X, UserCircle2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminNotifications from '@/components/AdminNotifications';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [newAppPopup, setNewAppPopup] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel('admin-loan-alerts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'loan_applications' },
        () => {
          setNewAppPopup(true);
          setTimeout(() => setNewAppPopup(false), 6000);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const navLinks = [
    { name: 'Overview', href: '/admin', icon: BarChart3 },
    { name: 'Clients', href: '/admin/clients', icon: UserCircle2 },
    { name: 'Send Promo', href: '/admin/send-promo', icon: Send },
    { name: 'Campaigns', href: '/admin/campaigns', icon: Megaphone },
    { name: 'Applications', href: '/admin/applications', icon: FileText },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: Activity },
    { name: 'Agents', href: '/admin/agents', icon: Headphones },
    { name: 'Affiliates', href: '/admin/affiliates', icon: LinkIcon },
  ];

  const featureLinks = [
    { name: 'AI Risk Scoring', href: '/features/risk-scoring', icon: Brain },
    { name: 'Payments', href: '/features/real-time-payments', icon: Zap },
    { name: 'Open Banking', href: '/features/open-banking', icon: Globe },
    { name: 'ESG Analytics', href: '/features/esg-analytics', icon: Leaf },
  ];

  return (
    <div className="admin-layout-root min-h-screen flex bg-gradient-to-br from-[#e6f7ec]/60 via-white to-[#f0fdf4]/30 relative overflow-hidden">

      {/* Real-time Popup Alert */}
      {newAppPopup && (
        <div className="fixed top-10 right-5 z-50 bg-white border border-[#00b074]/20 shadow-[0_10px_40px_-10px_rgba(0,176,116,0.3)] rounded-2xl p-4 pr-12 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <button onClick={() => setNewAppPopup(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
          <div className="bg-[#00b074]/10 p-2 rounded-xl">
            <BellRing className="h-5 w-5 text-[#00b074] animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">New Application!</h4>
            <p className="text-xs text-gray-500 mt-0.5">A customer just submitted a loan request.</p>
            <Link href="/admin/applications" onClick={() => setNewAppPopup(false)} className="text-[#00b074] text-xs font-bold mt-1 inline-flex hover:underline">
              View →
            </Link>
          </div>
        </div>
      )}

      {/* Sidebar — compact */}
      <div className="w-56 flex-shrink-0 flex flex-col pt-4 px-3 bg-transparent z-10">
        {/* Sidebar Header */}
        <div className="mb-2 px-2">
          <p className="text-[12px] font-bold text-gray-900 uppercase tracking-widest mb-1">Admin Control</p>
          <div className="flex items-center gap-2 bg-white shadow-sm text-[#00b074] px-3 py-1.5 rounded-lg font-medium text-xs">
            <ShieldCheck className="h-3.5 w-3.5" />
            Access
          </div>
        </div>

        <nav className="flex flex-col gap-0.5 flex-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-white shadow-[0_2px_10px_-3px_rgba(0,176,116,0.15)] text-[#00b074]'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#00b074]' : ''}`} />
                <span className="text-[13px]">{link.name}</span>
              </Link>
            );
          })}

          {/* AI Features */}
          <div className="mt-4 mb-1 px-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AI Features</p>
          </div>
          {featureLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs text-gray-400 hover:text-[#00b074] hover:bg-white/50 transition-all"
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto flex flex-col relative">
        {/* Floating Notifications in right corner */}
        <div className="absolute top-4 right-6 z-50">
          <AdminNotifications />
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
