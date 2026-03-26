'use client';

import { useState, useEffect } from 'react';
import { Link as LinkIcon, Users, IndianRupee, TrendingUp, RefreshCw, ExternalLink, UserPlus, BarChart3 } from 'lucide-react';

interface Affiliate {
  id: string;
  name: string;
  code: string;
  referrals: number;
  conversions: number;
  earnings: number;
  status: 'active' | 'inactive';
}

const demoAffiliates: Affiliate[] = [
  { id: '1', name: 'FinServ Partners', code: 'FINSERV2026', referrals: 156, conversions: 42, earnings: 284000, status: 'active' },
  { id: '2', name: 'Digital Lending Co.', code: 'DLEND2026', referrals: 89, conversions: 28, earnings: 196000, status: 'active' },
  { id: '3', name: 'Credit Hub India', code: 'CHUB2026', referrals: 234, conversions: 67, earnings: 468000, status: 'active' },
  { id: '4', name: 'Loan Bazaar', code: 'LBAZ2026', referrals: 45, conversions: 12, earnings: 84000, status: 'inactive' },
];

export default function AdminAffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAffiliates(demoAffiliates);
      setLoading(false);
    }, 500);
  }, []);

  const totalReferrals = affiliates.reduce((s, a) => s + a.referrals, 0);
  const totalConversions = affiliates.reduce((s, a) => s + a.conversions, 0);
  const totalEarnings = affiliates.reduce((s, a) => s + a.earnings, 0);
  const conversionRate = totalReferrals > 0 ? ((totalConversions / totalReferrals) * 100).toFixed(1) : '0';

  return (
    <div className="p-8 lg:p-12 max-w-6xl fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
            <LinkIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Affiliate Network</h1>
            <p className="text-slate-500 text-sm">Track partners, referrals, and commission payouts</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-[#00b074] to-[#008f5d] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-emerald-200">
          <UserPlus className="h-4 w-4" /> Add Partner
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Referrals', value: totalReferrals, icon: Users, color: '#3b82f6' },
          { label: 'Conversions', value: totalConversions, icon: TrendingUp, color: '#10b981' },
          { label: 'Conversion Rate', value: `${conversionRate}%`, icon: BarChart3, color: '#8b5cf6' },
          { label: 'Total Payouts', value: `₹${(totalEarnings / 1000).toFixed(0)}K`, icon: IndianRupee, color: '#f59e0b' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm slide-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${kpi.color}12` }}>
              <kpi.icon className="h-5 w-5" style={{ color: kpi.color }} />
            </div>
            <p className="text-2xl font-black text-slate-900">{loading ? '—' : kpi.value}</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Affiliates Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Partner Directory</h2>
          <p className="text-sm text-slate-400">Active and inactive affiliate partners</p>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-400">Loading partners...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Partner</th>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Referrals</th>
                  <th className="px-6 py-3">Conversions</th>
                  <th className="px-6 py-3">Earnings</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {affiliates.map((aff) => (
                  <tr key={aff.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{aff.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{aff.code}</code>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{aff.referrals}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{aff.conversions}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#00b074] flex items-center gap-0.5">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {aff.earnings.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${aff.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                        {aff.status}
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
