'use client';

import { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Activity, Shield, BarChart3, Zap } from 'lucide-react';

const riskFactors = [
    { name: 'Payment History', score: 92, weight: '35%', trend: 'up', status: 'Excellent' },
    { name: 'Credit Utilization', score: 68, weight: '30%', trend: 'down', status: 'Good' },
    { name: 'Account Age', score: 85, weight: '15%', trend: 'up', status: 'Very Good' },
    { name: 'Credit Mix', score: 74, weight: '10%', trend: 'up', status: 'Good' },
    { name: 'Recent Inquiries', score: 56, weight: '10%', trend: 'down', status: 'Fair' },
];

const mlModels = [
    { name: 'Gradient Boosting (XGBoost)', confidence: 94, latency: '12ms', version: 'v3.2.1' },
    { name: 'Neural Network (LSTM)', confidence: 91, latency: '28ms', version: 'v2.8.0' },
    { name: 'Random Forest Ensemble', confidence: 89, latency: '8ms', version: 'v4.1.0' },
    { name: 'Logistic Regression (Baseline)', confidence: 82, latency: '3ms', version: 'v1.0.0' },
];

const recentAssessments = [
    { id: 'RSK-7823', customer: 'Arjun Mehta', score: 812, risk: 'Low', amount: '₹15,00,000', time: '2 min ago' },
    { id: 'RSK-7822', customer: 'Priya Sharma', score: 645, risk: 'Medium', amount: '₹8,50,000', time: '5 min ago' },
    { id: 'RSK-7821', customer: 'Ravi Kumar', score: 490, risk: 'High', amount: '₹25,00,000', time: '8 min ago' },
    { id: 'RSK-7820', customer: 'Sneha Patel', score: 780, risk: 'Low', amount: '₹12,00,000', time: '12 min ago' },
];

export default function RiskScoringPage() {
    const [overallScore, setOverallScore] = useState(0);
    const [animatedFactors, setAnimatedFactors] = useState<number[]>(riskFactors.map(() => 0));

    useEffect(() => {
        const timer = setTimeout(() => setOverallScore(756), 300);
        const factorTimers = riskFactors.map((f, i) =>
            setTimeout(() => {
                setAnimatedFactors(prev => {
                    const next = [...prev];
                    next[i] = f.score;
                    return next;
                });
            }, 500 + i * 150)
        );
        return () => { clearTimeout(timer); factorTimers.forEach(clearTimeout); };
    }, []);

    const getScoreColor = (score: number) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const getRiskBadge = (risk: string) => {
        const styles: Record<string, string> = {
            Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            Medium: 'bg-amber-50 text-amber-700 border-amber-200',
            High: 'bg-red-50 text-red-700 border-red-200',
        };
        return styles[risk] || '';
    };

    return (
        <div className="p-8 lg:p-12 max-w-6xl fade-in">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200">
                        <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-[28px] font-black text-slate-900 tracking-tight">AI-Driven Risk Scoring</h1>
                        <p className="text-slate-500 text-sm">Machine learning models analyze 200+ data points in real-time</p>
                    </div>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Assessments Today', value: '1,247', icon: Activity, color: '#8b5cf6', change: '+12%' },
                    { label: 'Avg. Risk Score', value: '712', icon: BarChart3, color: '#3b82f6', change: '+3.2%' },
                    { label: 'Model Accuracy', value: '94.7%', icon: Shield, color: '#10b981', change: '+0.8%' },
                    { label: 'Avg. Latency', value: '14ms', icon: Zap, color: '#f59e0b', change: '-2ms' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}12` }}>
                                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                            </div>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{stat.change}</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Overall Score Gauge */}
                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm text-center">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Overall Credit Score</p>
                    <div className="relative w-48 h-48 mx-auto mb-6">
                        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                            <circle
                                cx="60" cy="60" r="52" fill="none"
                                stroke="url(#scoreGradient)" strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${(overallScore / 900) * 327} 327`}
                                className="transition-all duration-1000 ease-out"
                            />
                            <defs>
                                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#06b6d4" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black text-slate-900 transition-all duration-1000">{overallScore}</span>
                            <span className="text-xs font-bold text-slate-400">/ 900</span>
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                        <CheckCircle2 className="h-4 w-4" />
                        Very Good
                    </div>
                </div>

                {/* Risk Factors Breakdown */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-5">Risk Factor Breakdown</p>
                    <div className="space-y-4">
                        {riskFactors.map((factor, i) => (
                            <div key={i} className="group">
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-slate-700">{factor.name}</span>
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{factor.weight}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {factor.trend === 'up' ? (
                                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                                        ) : (
                                            <TrendingDown className="h-3.5 w-3.5 text-amber-500" />
                                        )}
                                        <span className="text-sm font-bold" style={{ color: getScoreColor(factor.score) }}>{animatedFactors[i]}</span>
                                    </div>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700 ease-out"
                                        style={{
                                            width: `${animatedFactors[i]}%`,
                                            background: `linear-gradient(90deg, ${getScoreColor(factor.score)}cc, ${getScoreColor(factor.score)})`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ML Models & Recent Assessments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ML Model Performance */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-5">ML Model Performance</p>
                    <div className="space-y-3">
                        {mlModels.map((model, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                                <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center text-sm font-black text-violet-600">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{model.name}</p>
                                    <p className="text-xs text-slate-400">{model.version} · {model.latency}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-slate-900">{model.confidence}%</p>
                                    <p className="text-[10px] text-slate-400 font-medium">confidence</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Assessments */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Recent Assessments</p>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Live
                        </div>
                    </div>
                    <div className="space-y-3">
                        {recentAssessments.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-slate-800">{item.customer}</p>
                                        <span className="text-[10px] font-mono text-slate-400">{item.id}</span>
                                    </div>
                                    <p className="text-xs text-slate-400">{item.amount} · {item.time}</p>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                    <span className="text-lg font-black text-slate-900">{item.score}</span>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${getRiskBadge(item.risk)}`}>
                                        {item.risk === 'High' && <AlertTriangle className="h-3 w-3 inline mr-0.5" />}
                                        {item.risk}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
