'use client';

import { useState } from 'react';
import { Globe, Lock, Code2, CheckCircle2, Copy, ExternalLink, Shield, Key, Users, Activity } from 'lucide-react';

const endpoints = [
    { method: 'GET', path: '/api/v2/accounts', desc: 'List customer accounts', auth: 'OAuth 2.0', status: 'stable', latency: '45ms' },
    { method: 'POST', path: '/api/v2/payments/initiate', desc: 'Initiate a payment', auth: 'OAuth 2.0 + MFA', status: 'stable', latency: '120ms' },
    { method: 'GET', path: '/api/v2/transactions', desc: 'Transaction history', auth: 'OAuth 2.0', status: 'stable', latency: '62ms' },
    { method: 'POST', path: '/api/v2/consent/create', desc: 'Create data consent', auth: 'mTLS + JWT', status: 'beta', latency: '88ms' },
    { method: 'GET', path: '/api/v2/products', desc: 'Product catalog', auth: 'API Key', status: 'stable', latency: '32ms' },
    { method: 'DELETE', path: '/api/v2/consent/{id}', desc: 'Revoke consent', auth: 'OAuth 2.0', status: 'stable', latency: '55ms' },
];

const partners = [
    { name: 'Razorpay', status: 'Active', calls: '2.4M/day', uptime: '99.99%' },
    { name: 'PhonePe', status: 'Active', calls: '1.8M/day', uptime: '99.97%' },
    { name: 'Paytm', status: 'Active', calls: '945K/day', uptime: '99.95%' },
    { name: 'Google Pay', status: 'Onboarding', calls: '—', uptime: '—' },
];

const sampleResponse = `{
  "data": {
    "account_id": "ACC-7829301",
    "holder": "Arjun Mehta",
    "type": "savings",
    "balance": {
      "amount": 245000.50,
      "currency": "INR"
    },
    "status": "active",
    "consent_id": "CNS-2026-0034"
  },
  "meta": {
    "request_id": "req_8a7f3bc2",
    "timestamp": "2026-03-25T15:12:00Z"
  }
}`;

export default function OpenBankingPage() {
    const [activeEndpoint, setActiveEndpoint] = useState(0);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(sampleResponse);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getMethodColor = (method: string) => {
        const colors: Record<string, string> = {
            GET: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            POST: 'bg-blue-50 text-blue-700 border-blue-200',
            PUT: 'bg-amber-50 text-amber-700 border-amber-200',
            DELETE: 'bg-red-50 text-red-700 border-red-200',
        };
        return colors[method] || '';
    };

    return (
        <div className="p-8 lg:p-12 max-w-6xl fade-in">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-200">
                        <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Open Banking APIs</h1>
                        <p className="text-slate-500 text-sm">Secure, standards-compliant APIs for third-party integrations</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'API Calls Today', value: '5.1M', icon: Activity, color: '#3b82f6' },
                    { label: 'Active Partners', value: '24', icon: Users, color: '#8b5cf6' },
                    { label: 'Avg. Latency', value: '62ms', icon: Globe, color: '#06b6d4' },
                    { label: 'Security Score', value: 'A+', icon: Shield, color: '#10b981' },
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

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                {/* Endpoint Catalog */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">API Endpoint Catalog</p>
                        <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">v2.4.0</span>
                    </div>
                    <div className="space-y-2">
                        {endpoints.map((ep, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveEndpoint(i)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${activeEndpoint === i ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50 border border-transparent'
                                    }`}
                            >
                                <span className={`text-[10px] font-black px-2 py-1 rounded border ${getMethodColor(ep.method)} min-w-[52px] text-center`}>
                                    {ep.method}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-mono font-semibold text-slate-800 truncate">{ep.path}</p>
                                    <p className="text-xs text-slate-400">{ep.desc}</p>
                                </div>
                                <div className="hidden md:flex items-center gap-2">
                                    <Lock className="h-3 w-3 text-slate-400" />
                                    <span className="text-[10px] text-slate-400">{ep.auth}</span>
                                </div>
                                {ep.status === 'beta' && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                                        BETA
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Response Preview */}
                <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 shadow-sm text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Code2 className="h-4 w-4 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-300">Response Preview</span>
                        </div>
                        <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                            {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-slate-800">
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                            {endpoints[activeEndpoint].method}
                        </span>
                        <span className="text-xs font-mono text-slate-300 truncate">{endpoints[activeEndpoint].path}</span>
                    </div>
                    <pre className="text-xs font-mono text-emerald-300/80 leading-relaxed overflow-auto max-h-[320px] whitespace-pre-wrap">
                        {sampleResponse}
                    </pre>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700">
                        <div className="text-xs text-slate-400">
                            <span className="text-slate-500">Status:</span> <span className="text-emerald-400">200 OK</span>
                        </div>
                        <div className="text-xs text-slate-400">
                            <span className="text-slate-500">Time:</span> <span className="text-cyan-400">{endpoints[activeEndpoint].latency}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* OAuth Flow + Partners */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* OAuth Flow */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-5">OAuth 2.0 Authorization Flow</p>
                    <div className="space-y-4">
                        {[
                            { step: '1', title: 'Client Registration', desc: 'Register app and obtain client credentials', icon: Key },
                            { step: '2', title: 'Authorization Request', desc: 'Redirect user to consent screen', icon: ExternalLink },
                            { step: '3', title: 'User Consent', desc: 'Customer approves data access scope', icon: CheckCircle2 },
                            { step: '4', title: 'Token Exchange', desc: 'Exchange auth code for access + refresh tokens', icon: Lock },
                            { step: '5', title: 'API Access', desc: 'Use bearer token for authenticated API calls', icon: Globe },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-black text-blue-600 shrink-0">
                                    {item.step}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                                    <p className="text-xs text-slate-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Partner Integrations */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-5">Partner Integrations</p>
                    <div className="space-y-3">
                        {partners.map((p, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-sm font-black text-slate-600">
                                    {p.name[0]}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                                    <p className="text-xs text-slate-400">{p.calls} calls</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${p.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                        }`}>
                                        {p.status}
                                    </span>
                                    {p.uptime !== '—' && (
                                        <p className="text-[10px] text-slate-400 mt-1">{p.uptime} uptime</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
