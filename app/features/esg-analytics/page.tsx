'use client';

import { useState, useEffect } from 'react';
import { Leaf, TrendingUp, Droplets, Wind, Zap, TreePine, Factory, Recycle, Target, Award } from 'lucide-react';

const portfolioBreakdown = [
    { name: 'Green Bonds', pct: 32, value: '₹156 Cr', color: '#10b981' },
    { name: 'Renewable Energy', pct: 24, value: '₹117 Cr', color: '#06b6d4' },
    { name: 'Sustainable Infra', pct: 18, value: '₹88 Cr', color: '#3b82f6' },
    { name: 'Clean Transport', pct: 14, value: '₹68 Cr', color: '#8b5cf6' },
    { name: 'Carbon Credits', pct: 8, value: '₹39 Cr', color: '#f59e0b' },
    { name: 'Other ESG', pct: 4, value: '₹20 Cr', color: '#ec4899' },
];

const impactMetrics = [
    { label: 'CO₂ Offset', value: '12,400', unit: 'tonnes/yr', icon: Wind, color: '#06b6d4', target: '15,000' },
    { label: 'Water Saved', value: '8.2M', unit: 'litres/yr', icon: Droplets, color: '#3b82f6', target: '10M' },
    { label: 'Clean Energy', value: '45', unit: 'MW funded', icon: Zap, color: '#f59e0b', target: '60' },
    { label: 'Trees Planted', value: '24,000', unit: 'trees', icon: TreePine, color: '#10b981', target: '30,000' },
];

const sustainabilityGoals = [
    { goal: 'Net Zero by 2030', progress: 68, status: 'On Track', icon: Factory },
    { goal: 'Green Portfolio 50%', progress: 74, status: 'On Track', icon: Leaf },
    { goal: '100% Renewable Ops', progress: 82, status: 'Ahead', icon: Zap },
    { goal: 'Zero Waste Banking', progress: 45, status: 'At Risk', icon: Recycle },
];

export default function ESGAnalyticsPage() {
    const [esgScore, setEsgScore] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setEsgScore(82), 400);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="p-8 lg:p-12 max-w-6xl fade-in">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                        <Leaf className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-[28px] font-black text-slate-900 tracking-tight">ESG &amp; Sustainability Analytics</h1>
                        <p className="text-slate-500 text-sm">Environmental, Social &amp; Governance impact tracking</p>
                    </div>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {impactMetrics.map((metric, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${metric.color}12` }}>
                                <metric.icon className="h-5 w-5" style={{ color: metric.color }} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">Target: {metric.target}</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900">{metric.value}</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{metric.label} · {metric.unit}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* ESG Score Gauge */}
                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm text-center">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">ESG Composite Score</p>
                    <div className="relative w-48 h-48 mx-auto mb-6">
                        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                            <circle
                                cx="60" cy="60" r="52" fill="none"
                                stroke="url(#esgGradient)" strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${(esgScore / 100) * 327} 327`}
                                className="transition-all duration-1000 ease-out"
                            />
                            <defs>
                                <linearGradient id="esgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#06b6d4" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black text-slate-900">{esgScore}</span>
                            <span className="text-xs font-bold text-slate-400">/ 100</span>
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                        <Award className="h-4 w-4" />
                        AA Rating
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-6">
                        <div className="text-center">
                            <p className="text-lg font-black text-emerald-600">E: 85</p>
                            <p className="text-[10px] text-slate-400">Environmental</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-black text-blue-600">S: 78</p>
                            <p className="text-[10px] text-slate-400">Social</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-black text-violet-600">G: 83</p>
                            <p className="text-[10px] text-slate-400">Governance</p>
                        </div>
                    </div>
                </div>

                {/* Green Portfolio Breakdown */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Green Portfolio · ₹488 Cr</p>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> +18.4% YoY
                        </span>
                    </div>

                    {/* Stacked bar */}
                    <div className="flex h-6 rounded-full overflow-hidden mb-6">
                        {portfolioBreakdown.map((item, i) => (
                            <div
                                key={i}
                                className="transition-all duration-700 ease-out hover:opacity-80 cursor-pointer"
                                style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                                title={`${item.name}: ${item.pct}%`}
                            />
                        ))}
                    </div>

                    <div className="space-y-3">
                        {portfolioBreakdown.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                                </div>
                                <p className="text-sm font-bold text-slate-900">{item.value}</p>
                                <span className="text-xs font-bold text-slate-400 w-10 text-right">{item.pct}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sustainability Goals */}
            <div className="bg-gradient-to-br from-emerald-50 via-white to-cyan-50 rounded-2xl border border-emerald-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <Target className="h-5 w-5 text-emerald-600" />
                    <p className="text-sm font-bold text-slate-700 uppercase tracking-wider">Sustainability Goals Progress</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sustainabilityGoals.map((goal, i) => (
                        <div key={i} className="bg-white rounded-xl p-5 border border-slate-100 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <goal.icon className="h-4 w-4 text-emerald-600" />
                                    <p className="text-sm font-bold text-slate-800">{goal.goal}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${goal.status === 'Ahead' ? 'bg-emerald-50 text-emerald-700' :
                                        goal.status === 'On Track' ? 'bg-blue-50 text-blue-700' :
                                            'bg-amber-50 text-amber-700'
                                    }`}>
                                    {goal.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700 ease-out"
                                        style={{
                                            width: `${goal.progress}%`,
                                            backgroundColor: goal.status === 'At Risk' ? '#f59e0b' : '#10b981',
                                        }}
                                    />
                                </div>
                                <span className="text-sm font-black text-slate-700">{goal.progress}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
