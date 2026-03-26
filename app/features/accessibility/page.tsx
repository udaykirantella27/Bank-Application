'use client';

import { Accessibility, Eye, Ear, Hand, Monitor, CheckCircle2, XCircle, AlertTriangle, Volume2, Keyboard, MousePointer2 } from 'lucide-react';

const wcagChecklist = [
    { rule: 'Color Contrast (AA)', status: 'pass', ratio: '7.2:1', required: '4.5:1' },
    { rule: 'Color Contrast (AAA)', status: 'pass', ratio: '7.2:1', required: '7:1' },
    { rule: 'Keyboard Navigation', status: 'pass', coverage: '100%', required: '100%' },
    { rule: 'Screen Reader Labels', status: 'pass', coverage: '98%', required: '95%' },
    { rule: 'Focus Indicators', status: 'pass', coverage: '100%', required: '100%' },
    { rule: 'Touch Targets (48px)', status: 'warning', coverage: '92%', required: '100%' },
    { rule: 'Alt Text for Images', status: 'pass', coverage: '100%', required: '100%' },
    { rule: 'Reduced Motion Support', status: 'pass', coverage: '95%', required: '90%' },
];

const accessModes = [
    { name: 'Visual', icon: Eye, score: 96, features: ['High contrast mode', 'Text scaling 200%', 'Color-blind themes'], color: '#8b5cf6' },
    { name: 'Auditory', icon: Ear, score: 94, features: ['Screen reader optimized', 'Audio descriptions', 'Captioned media'], color: '#3b82f6' },
    { name: 'Motor', icon: Hand, score: 91, features: ['Keyboard-only nav', 'Voice commands', 'Switch access'], color: '#ec4899' },
    { name: 'Cognitive', icon: Monitor, score: 93, features: ['Simple language', 'Predictable patterns', 'Clear error states'], color: '#f59e0b' },
];

export default function AccessibilityPage() {
    const passCount = wcagChecklist.filter(r => r.status === 'pass').length;
    const totalCount = wcagChecklist.length;

    return (
        <div className="p-8 lg:p-12 max-w-6xl fade-in">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-200">
                        <Accessibility className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Embodied UX &amp; Accessibility</h1>
                        <p className="text-slate-500 text-sm">WCAG 2.2 AA/AAA compliant — inclusive banking for everyone</p>
                    </div>
                </div>
            </div>

            {/* Overall Score */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'WCAG Compliance', value: `${passCount}/${totalCount}`, icon: CheckCircle2, color: '#10b981' },
                    { label: 'Lighthouse A11Y', value: '98/100', icon: Eye, color: '#8b5cf6' },
                    { label: 'Voice Nav Coverage', value: '94%', icon: Volume2, color: '#3b82f6' },
                    { label: 'Keyboard Coverage', value: '100%', icon: Keyboard, color: '#ec4899' },
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
                {/* WCAG Checklist */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-5">WCAG 2.2 Compliance Audit</p>
                    <div className="space-y-2">
                        {wcagChecklist.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                {item.status === 'pass' ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                ) : item.status === 'warning' ? (
                                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                                )}
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-800">{item.rule}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${item.status === 'pass' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                    }`}>
                                    {item.coverage || item.ratio}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Access Mode Scores */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-5">Access Mode Support</p>
                    <div className="space-y-5">
                        {accessModes.map((mode, i) => (
                            <div key={i} className="group">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${mode.color}12` }}>
                                        <mode.icon className="h-4 w-4" style={{ color: mode.color }} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-slate-800">{mode.name}</p>
                                            <span className="text-lg font-black" style={{ color: mode.color }}>{mode.score}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                                    <div
                                        className="h-full rounded-full transition-all duration-700 ease-out"
                                        style={{ width: `${mode.score}%`, backgroundColor: mode.color }}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {mode.features.map((feat, j) => (
                                        <span key={j} className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
                                            {feat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Interactive Demo Section */}
            <div className="bg-gradient-to-br from-pink-50 via-white to-violet-50 rounded-2xl border border-pink-100 p-8 shadow-sm">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Interactive Accessibility Demo</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-slate-100 text-center hover:shadow-md transition-all group cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Keyboard className="h-7 w-7 text-violet-600" />
                        </div>
                        <p className="text-sm font-bold text-slate-800 mb-1">Keyboard Navigation</p>
                        <p className="text-xs text-slate-400">Press Tab and Enter to navigate all features without a mouse</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-slate-100 text-center hover:shadow-md transition-all group cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Volume2 className="h-7 w-7 text-blue-600" />
                        </div>
                        <p className="text-sm font-bold text-slate-800 mb-1">Voice Commands</p>
                        <p className="text-xs text-slate-400">&quot;Check loan status&quot; &quot;Transfer money&quot; — hands-free banking</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-slate-100 text-center hover:shadow-md transition-all group cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <MousePointer2 className="h-7 w-7 text-pink-600" />
                        </div>
                        <p className="text-sm font-bold text-slate-800 mb-1">Adaptive UI</p>
                        <p className="text-xs text-slate-400">Auto-adjusts for motor impairments with larger targets and simplified flows</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
