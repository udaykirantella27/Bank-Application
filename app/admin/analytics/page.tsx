'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, IndianRupee, Users, FileText, CheckCircle2, Clock, XCircle, RefreshCw, Home, Car, GraduationCap, CreditCard, Briefcase } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalDisbursed: number;
  campaignsSent: number;
}

interface Application {
  id: string;
  loan_purpose: string;
  loan_amount: number;
  status: string;
  created_at: string;
}

const purposeIcons: Record<string, typeof Home> = {
  home: Home,
  vehicle: Car,
  auto: Car,
  education: GraduationCap,
  personal: CreditCard,
  business: Briefcase,
};

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, appsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/applications'),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (appsRes.ok) {
        const data = await appsRes.json();
        setApps(data.applications || []);
      }
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Compute analytics
  const approvalRate = stats && stats.totalApplications > 0
    ? ((stats.approvedApplications / stats.totalApplications) * 100).toFixed(1)
    : '0';

  const rejectionRate = stats && stats.totalApplications > 0
    ? ((stats.rejectedApplications / stats.totalApplications) * 100).toFixed(1)
    : '0';

  const avgLoanAmount = apps.length > 0
    ? apps.reduce((s, a) => s + Number(a.loan_amount || 0), 0) / apps.length
    : 0;

  // Loans by purpose
  const purposeMap: Record<string, { count: number; total: number }> = {};
  apps.forEach(a => {
    const p = a.loan_purpose || 'other';
    if (!purposeMap[p]) purposeMap[p] = { count: 0, total: 0 };
    purposeMap[p].count++;
    purposeMap[p].total += Number(a.loan_amount || 0);
  });
  const purposeData = Object.entries(purposeMap).sort((a, b) => b[1].count - a[1].count);
  const maxPurposeCount = Math.max(...purposeData.map(([, d]) => d.count), 1);

  // Monthly trend (last 6 months)
  const monthlyData: Record<string, number> = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    monthlyData[key] = 0;
  }
  apps.forEach(a => {
    const d = new Date(a.created_at);
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    if (key in monthlyData) monthlyData[key]++;
  });
  const monthlyEntries = Object.entries(monthlyData);
  const maxMonthly = Math.max(...monthlyEntries.map(([, v]) => v), 1);

  return (
    <div className="p-8 lg:p-12 max-w-6xl fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Analytics</h1>
            <p className="text-slate-500 text-sm">Loan processing metrics and business insights</p>
          </div>
        </div>
        <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-sm disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading analytics...</div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Approval Rate', value: `${approvalRate}%`, icon: CheckCircle2, color: '#10b981' },
              { label: 'Rejection Rate', value: `${rejectionRate}%`, icon: XCircle, color: '#ef4444' },
              { label: 'Avg. Loan Amount', value: `₹${(avgLoanAmount / 100000).toFixed(1)}L`, icon: IndianRupee, color: '#3b82f6' },
              { label: 'Total Disbursed', value: `₹${((stats?.totalDisbursed || 0) / 100000).toFixed(1)}L`, icon: TrendingUp, color: '#8b5cf6' },
            ].map((kpi, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${kpi.color}12` }}>
                  <kpi.icon className="h-5 w-5" style={{ color: kpi.color }} />
                </div>
                <p className="text-2xl font-black text-slate-900">{kpi.value}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{kpi.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Trend */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Monthly Applications</h3>
              <p className="text-xs text-slate-400 mb-6">Last 6 months trend</p>
              <div className="flex items-end gap-3 h-40">
                {monthlyEntries.map(([month, count], i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">{count}</span>
                    <div className="w-full rounded-t-lg transition-all" style={{
                      height: `${Math.max((count / maxMonthly) * 120, 4)}px`,
                      background: `linear-gradient(to top, #00b074, #06b6d4)`,
                      opacity: 0.8 + (i * 0.04),
                    }} />
                    <span className="text-[10px] text-slate-400 font-medium">{month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Loans by Purpose */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Applications by Purpose</h3>
              <p className="text-xs text-slate-400 mb-6">Distribution across loan types</p>
              <div className="space-y-4">
                {purposeData.length === 0 ? (
                  <p className="text-sm text-slate-400 py-8 text-center">No data available</p>
                ) : (
                  purposeData.map(([purpose, data], i) => {
                    const Icon = purposeIcons[purpose] || FileText;
                    const percentage = ((data.count / apps.length) * 100).toFixed(0);
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-slate-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-slate-700 capitalize">{purpose}</span>
                            <span className="text-xs text-slate-400">{data.count} ({percentage}%)</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#00b074] to-[#06b6d4] rounded-full transition-all" style={{ width: `${(data.count / maxPurposeCount) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Application Status Breakdown</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Pending', count: stats?.pendingApplications || 0, color: '#f59e0b', icon: Clock },
                { label: 'Approved', count: stats?.approvedApplications || 0, color: '#10b981', icon: CheckCircle2 },
                { label: 'Rejected', count: stats?.rejectedApplications || 0, color: '#ef4444', icon: XCircle },
              ].map((s, i) => {
                const total = stats?.totalApplications || 1;
                const pct = ((s.count / total) * 100).toFixed(0);
                return (
                  <div key={i} className="text-center p-4 rounded-xl" style={{ backgroundColor: `${s.color}08` }}>
                    <s.icon className="h-6 w-6 mx-auto mb-2" style={{ color: s.color }} />
                    <p className="text-2xl font-black text-slate-900">{s.count}</p>
                    <p className="text-xs font-medium mt-0.5" style={{ color: s.color }}>{s.label} ({pct}%)</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
