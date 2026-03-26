'use client';

import { useState, useEffect } from 'react';
import { Activity, Users, FileText, TrendingUp, IndianRupee, CheckCircle2, Clock, XCircle, ArrowUpRight, Megaphone, BarChart3, Send, Eye, CreditCard, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalUsers: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalDisbursed: number;
  campaignsSent: number;
}

interface RecentApp {
  id: string;
  name: string;
  email: string;
  amount: number;
  purpose: string;
  status: string;
  created_at: string;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0, totalApplications: 0, pendingApplications: 0,
    approvedApplications: 0, rejectedApplications: 0, totalDisbursed: 0, campaignsSent: 0,
  });
  const [recentApps, setRecentApps] = useState<RecentApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appsRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/applications?limit=5'),
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (appsRes.ok) {
          const data = await appsRes.json();
          setRecentApps(data.applications || []);
        }
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#3b82f6' },
    { label: 'Applications', value: stats.totalApplications, icon: FileText, color: '#8b5cf6' },
    { label: 'Pending Review', value: stats.pendingApplications, icon: Clock, color: '#f59e0b' },
    { label: 'Approved', value: stats.approvedApplications, icon: CheckCircle2, color: '#10b981' },
    { label: 'Disbursed', value: `₹${(stats.totalDisbursed / 100000).toFixed(1)}L`, icon: IndianRupee, color: '#06b6d4' },
    { label: 'Promos Sent', value: stats.campaignsSent, icon: Megaphone, color: '#ec4899' },
  ];

  const quickActions = [
    { label: 'Send Promo Offer', href: '/admin/send-promo', icon: Send, color: '#ec4899' },
    { label: 'View Applications', href: '/admin/applications', icon: FileText, color: '#8b5cf6' },
    { label: 'Manage Users', href: '/admin/users', icon: Users, color: '#3b82f6' },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3, color: '#06b6d4' },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
    };
    return styles[status] || 'bg-slate-50 text-slate-600 border-slate-200';
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-lg shadow-slate-300">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">QIB Banking — Real-time overview</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {quickActions.map((action, i) => (
          <Link key={i} href={action.href} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group slide-up" style={{ animationDelay: `${i * 50}ms` }}>
            <action.icon className="h-5 w-5 mb-2.5 group-hover:scale-110 transition-transform" style={{ color: action.color }} />
            <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">{action.label}</p>
            <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 mt-1 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all slide-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}12` }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{loading ? '—' : stat.value}</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
            <p className="text-sm text-slate-400">Latest loan applications requiring review</p>
          </div>
          <Link href="/admin/applications" className="text-sm font-semibold text-[#00b074] hover:underline flex items-center gap-1">
            View All <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-400">Loading...</div>
        ) : recentApps.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="h-12 w-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No applications yet</p>
            <p className="text-sm text-slate-400 mt-1">Applications will appear here once customers apply.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Applicant</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Purpose</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{app.name || 'Customer'}</p>
                      <p className="text-xs text-slate-400">{app.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#00b074] flex items-center gap-0.5">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {Number(app.amount).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 capitalize">{app.purpose}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${getStatusBadge(app.status)}`}>
                        {app.status === 'approved' && <CheckCircle2 className="h-3 w-3" />}
                        {app.status === 'pending' && <Clock className="h-3 w-3" />}
                        {app.status === 'rejected' && <XCircle className="h-3 w-3" />}
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
