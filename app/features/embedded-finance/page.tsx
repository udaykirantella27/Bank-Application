'use client';

import { Building2, Code2, Copy, CheckCircle2, TrendingUp, CreditCard, ShoppingBag, Smartphone, BarChart3, DollarSign } from 'lucide-react';
import { useState } from 'react';

const sdkCode = `// QIB Embedded Finance SDK
import { QIBEmbed } from '@qib/embed-sdk';

const qib = new QIBEmbed({
  partnerId: 'PTR-2026-ACME',
  apiKey: process.env.QIB_API_KEY,
  environment: 'production',
});

// Embed lending widget in your e-commerce checkout
const lendingWidget = qib.createWidget({
  type: 'buy-now-pay-later',
  amount: 24999,
  currency: 'INR',
  containerId: '#qib-bnpl-widget',
  theme: {
    primary: '#00b074',
    borderRadius: '12px',
  },
  onApproval: (result) => {
    console.log('Loan approved:', result.loanId);
  },
});

lendingWidget.mount();`;

const partners = [
    { name: 'Shopify India', type: 'E-commerce', revenue: '₹4.2 Cr', txns: '12.4K/day', status: 'Live' },
    { name: 'Zomato', type: 'Food Delivery', revenue: '₹2.8 Cr', txns: '8.7K/day', status: 'Live' },
    { name: 'MakeMyTrip', type: 'Travel', revenue: '₹1.9 Cr', txns: '3.2K/day', status: 'Live' },
    { name: 'Swiggy', type: 'Food Delivery', revenue: '₹1.5 Cr', txns: '6.1K/day', status: 'Pilot' },
    { name: 'Nykaa', type: 'Beauty', revenue: '—', txns: '—', status: 'Onboarding' },
];

const widgets = [
    { name: 'Buy Now Pay Later', icon: CreditCard, installs: '2,400+', color: '#8b5cf6' },
    { name: 'Instant Credit Line', icon: DollarSign, installs: '1,800+', color: '#3b82f6' },
    { name: 'Payment Gateway', icon: ShoppingBag, installs: '3,200+', color: '#10b981' },
    { name: 'KYC Verification', icon: Smartphone, installs: '950+', color: '#f59e0b' },
];

export default function EmbeddedFinancePage() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(sdkCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-8 lg:p-12 max-w-6xl fade-in">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-200">
                        <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Embedded Finance</h1>
                        <p className="text-slate-500 text-sm">White-label financial services for third-party platforms</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Partner Revenue', value: '₹10.4 Cr', icon: TrendingUp, color: '#10b981' },
                    { label: 'Active Partners', value: '18', icon: Building2, color: '#06b6d4' },
                    { label: 'Widget Installs', value: '8,350+', icon: Code2, color: '#8b5cf6' },
                    { label: 'Daily Transactions', value: '30.4K', icon: BarChart3, color: '#f59e0b' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${stat.color}12` }}>
                            <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                        </div>
                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Widget Catalog */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-5">White-Label Widgets</p>
                    <div className="grid grid-cols-2 gap-3">
                        {widgets.map((w, i) => (
                            <div key={i} className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer group">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${w.color}12` }}>
                                    <w.icon className="h-5 w-5" style={{ color: w.color }} />
                                </div>
                                <p className="text-sm font-bold text-slate-800">{w.name}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{w.installs} installs</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Partner Revenue Table */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-5">Partner Integrations</p>
                    <div className="space-y-2">
                        {partners.map((p, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-50 to-teal-50 flex items-center justify-center text-sm font-black text-cyan-700">
                                    {p.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                                    <p className="text-xs text-slate-400">{p.type} · {p.txns}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-900">{p.revenue}</p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${p.status === 'Live' ? 'bg-emerald-50 text-emerald-700' :
                                            p.status === 'Pilot' ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-500'
                                        }`}>
                                        {p.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SDK Code Preview */}
            <div className="bg-slate-900 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-300">QIB Embed SDK — Quick Start</span>
                    </div>
                    <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                        {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <pre className="text-xs font-mono text-cyan-300/80 leading-relaxed overflow-auto max-h-[400px] whitespace-pre-wrap">
                    {sdkCode}
                </pre>
            </div>
        </div>
    );
}
