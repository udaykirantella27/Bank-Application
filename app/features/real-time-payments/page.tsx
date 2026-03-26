'use client';

import { useState, useEffect } from 'react';
import { Zap, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, RefreshCw, IndianRupee, Globe2, Timer } from 'lucide-react';

const liveTxns = [
    { id: 'TXN-90231', from: 'Arjun M.', to: 'Priya S.', amount: '₹2,45,000', type: 'out', status: 'settled', time: '0.3s', method: 'UPI 3.0' },
    { id: 'TXN-90230', from: 'HDFC Corp', to: 'QuincyBlessy', amount: '₹18,50,000', type: 'in', status: 'settled', time: '0.8s', method: 'RTGS' },
    { id: 'TXN-90229', from: 'Sneha P.', to: 'Amazon Pay', amount: '₹4,999', type: 'out', status: 'processing', time: '—', method: 'IMPS' },
    { id: 'TXN-90228', from: 'RBI Settlement', to: 'QuincyBlessy', amount: '₹1,25,00,000', type: 'in', status: 'settled', time: '1.2s', method: 'NEFT' },
    { id: 'TXN-90227', from: 'Ravi K.', to: 'Flipkart', amount: '₹12,499', type: 'out', status: 'settled', time: '0.4s', method: 'UPI 3.0' },
    { id: 'TXN-90226', from: 'State Bank', to: 'QuincyBlessy', amount: '₹45,00,000', type: 'in', status: 'settled', time: '0.6s', method: 'RTGS' },
];

const settlementTimeline = [
    { step: 'Payment Initiated', time: '0ms', done: true },
    { step: 'Auth & Validation', time: '45ms', done: true },
    { step: 'Fraud Check (AI)', time: '120ms', done: true },
    { step: 'Clearing House', time: '200ms', done: true },
    { step: 'Settlement Complete', time: '340ms', done: true },
];

export default function RealTimePaymentsPage() {
    const [pulse, setPulse] = useState(false);
    const [txnCount, setTxnCount] = useState(12847);

    useEffect(() => {
        const interval = setInterval(() => {
            setPulse(p => !p);
            setTxnCount(c => c + Math.floor(Math.random() * 3) + 1);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 lg:p-12 max-w-6xl fade-in">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200">
                        <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Real-Time Payments</h1>
                        <p className="text-slate-500 text-sm">Instant settlement powered by next-gen payment rails</p>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Transactions Today', value: txnCount.toLocaleString(), icon: RefreshCw, color: '#f59e0b', live: true },
                    { label: 'Avg. Settlement', value: '340ms', icon: Timer, color: '#8b5cf6' },
                    { label: 'Success Rate', value: '99.97%', icon: CheckCircle2, color: '#10b981' },
                    { label: 'Total Volume', value: '₹48.2 Cr', icon: IndianRupee, color: '#3b82f6' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}12` }}>
                                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                            </div>
                            {stat.live && (
                                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                                    <span className={`w-2 h-2 rounded-full bg-amber-500 ${pulse ? 'opacity-100' : 'opacity-40'} transition-opacity`} />
                                    LIVE
                                </span>
                            )}
                        </div>
                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Settlement Timeline */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Instant Settlement Pipeline</p>
                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 to-emerald-400" />
                        <div className="space-y-6">
                            {settlementTimeline.map((step, i) => (
                                <div key={i} className="flex items-center gap-4 relative slide-up" style={{ animationDelay: `${i * 120}ms` }}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${step.done ? 'bg-gradient-to-br from-amber-400 to-emerald-500' : 'bg-slate-200'
                                        }`}>
                                        {step.done ? (
                                            <CheckCircle2 className="h-4 w-4 text-white" />
                                        ) : (
                                            <Clock className="h-4 w-4 text-slate-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-800">{step.step}</p>
                                        <p className="text-xs text-slate-400">{step.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-100">
                        <p className="text-xs font-bold text-amber-800">⚡ Total end-to-end: 340ms</p>
                        <p className="text-[10px] text-amber-600 mt-0.5">98.5% faster than traditional NEFT (2-4 hours)</p>
                    </div>
                </div>

                {/* Live Transaction Feed */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Live Transaction Feed</p>
                        <div className="flex items-center gap-2">
                            <Globe2 className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-xs text-slate-400">All channels</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {liveTxns.map((txn, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${txn.type === 'in' ? 'bg-emerald-50' : 'bg-blue-50'
                                    }`}>
                                    {txn.type === 'in' ? (
                                        <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
                                    ) : (
                                        <ArrowUpRight className="h-5 w-5 text-blue-600" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-sm font-semibold text-slate-800">{txn.from}</p>
                                        <span className="text-slate-300">→</span>
                                        <p className="text-sm font-semibold text-slate-800">{txn.to}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] font-mono text-slate-400">{txn.id}</span>
                                        <span className="text-[10px] text-slate-300">·</span>
                                        <span className="text-[10px] font-medium text-slate-400">{txn.method}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-bold ${txn.type === 'in' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                        {txn.type === 'in' ? '+' : ''}{txn.amount}
                                    </p>
                                    <div className="flex items-center gap-1 justify-end mt-0.5">
                                        {txn.status === 'settled' ? (
                                            <>
                                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                <span className="text-[10px] font-medium text-emerald-600">{txn.time}</span>
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="h-3 w-3 text-amber-500 animate-spin" />
                                                <span className="text-[10px] font-medium text-amber-600">Processing</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Payment Methods Comparison */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-5">Settlement Speed Comparison</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { method: 'UPI 3.0', speed: '< 0.5s', bar: 98, color: '#f59e0b' },
                        { method: 'IMPS', speed: '< 2s', bar: 90, color: '#3b82f6' },
                        { method: 'RTGS', speed: '< 5s', bar: 75, color: '#8b5cf6' },
                        { method: 'NEFT', speed: '2-4 hrs', bar: 15, color: '#94a3b8' },
                    ].map((item, i) => (
                        <div key={i} className="text-center p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                            <p className="text-sm font-bold text-slate-700 mb-1">{item.method}</p>
                            <p className="text-2xl font-black text-slate-900 mb-3">{item.speed}</p>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${item.bar}%`, backgroundColor: item.color }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
