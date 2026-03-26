'use client';

import { ShieldCheck, Activity, Megaphone, FileText, Users, Link as LinkIcon, Brain, Zap, Globe, Leaf, Send, BarChart3, Headphones, BellRing, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminNotifications from '@/components/AdminNotifications';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [newAppPopup, setNewAppPopup] = useState(false);

  useEffect(() => {
    // Listen to real-time additions to the loan_applications table
    const channel = supabase
      .channel('admin-loan-alerts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'loan_applications' },
        (payload) => {
          setNewAppPopup(true);
          // Auto-hide after 6 seconds
          setTimeout(() => setNewAppPopup(false), 6000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const navLinks = [
    { name: 'Overview', href: '/admin', icon: BarChart3 },
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
    <div className="min-h-[calc(100vh-4rem)] flex bg-gradient-to-br from-[#e6f7ec]/60 via-white to-[#f0fdf4]/30 relative overflow-hidden">

      {/* Real-time Popup Alert */}
      {newAppPopup && (
        <div className="fixed top-24 right-8 z-50 bg-white border border-[#00b074]/20 shadow-[0_10px_40px_-10px_rgba(0,176,116,0.3)] rounded-2xl p-4 pr-12 flex items-start gap-4 slide-in-from-top-4 animate-in fade-in duration-300">
          <button onClick={() => setNewAppPopup(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
          <div className="bg-[#00b074]/10 p-2.5 rounded-xl">
            <BellRing className="h-6 w-6 text-[#00b074] animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 tracking-tight">Received an Application</h4>
            <p className="text-xs text-gray-500 font-medium mt-0.5">A customer just submitted a new loan request.</p>
            <Link href="/admin/applications" onClick={() => setNewAppPopup(false)} className="text-[#00b074] text-xs font-bold mt-2 inline-flex hover:underline">
              View Application
            </Link>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col py-8 px-4 bg-transparent z-10">
        <div className="mb-6 px-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">Admin Control</p>
            <AdminNotifications />
          </div>
          <div className="flex items-center gap-2 bg-white shadow-sm text-[#00b074] px-3 py-2 rounded-lg font-medium text-sm mb-6">
            <ShieldCheck className="h-4 w-4" />
            Elevated Access
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${isActive ? 'bg-white shadow-[0_2px_10px_-3px_rgba(0,176,116,0.15)] text-[#00b074]' : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'}`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#00b074]' : ''}`} />
                {link.name}
              </Link>
            )
          })}

          {/* AI Features Section */}
          <div className="mt-6 mb-2 px-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AI Features</p>
          </div>
          {featureLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-gray-400 hover:text-[#00b074] hover:bg-white/50 transition-all text-left"
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
