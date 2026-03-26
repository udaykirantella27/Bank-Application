'use client';

import { Brain, Zap, Globe, Accessibility, Building2, Leaf, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const featureLinks = [
        { name: 'AI Risk Scoring', href: '/features/risk-scoring', icon: Brain, color: '#8b5cf6' },
        { name: 'Real-Time Payments', href: '/features/real-time-payments', icon: Zap, color: '#f59e0b' },
        { name: 'Open Banking APIs', href: '/features/open-banking', icon: Globe, color: '#3b82f6' },
        { name: 'Accessibility UX', href: '/features/accessibility', icon: Accessibility, color: '#ec4899' },
        { name: 'Embedded Finance', href: '/features/embedded-finance', icon: Building2, color: '#06b6d4' },
        { name: 'ESG Analytics', href: '/features/esg-analytics', icon: Leaf, color: '#10b981' },
    ];

    return (
        <div className="min-h-[calc(100vh-4rem)] flex bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">

            {/* Ambient background decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-violet-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Sidebar */}
            <div className="w-72 flex-shrink-0 flex flex-col py-8 px-5 bg-white/60 backdrop-blur-xl border-r border-slate-100 z-10">

                <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6 px-2 group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="mb-6 px-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">Advanced Features</p>
                    <p className="text-xs text-slate-400">Enterprise Banking Suite 2026</p>
                </div>

                <nav className="flex flex-col gap-1 flex-1">
                    {featureLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-[13px] transition-all text-left group ${isActive
                                        ? 'bg-white shadow-lg shadow-slate-200/50 text-slate-900'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-white/70'
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive ? 'shadow-sm' : 'group-hover:scale-105'
                                        }`}
                                    style={{
                                        backgroundColor: isActive ? `${link.color}15` : 'transparent',
                                    }}
                                >
                                    <Icon
                                        className="h-4 w-4 transition-colors"
                                        style={{ color: isActive ? link.color : undefined }}
                                    />
                                </div>
                                {link.name}
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: link.color }} />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-2 pt-4 border-t border-slate-100 mt-4">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 text-white">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Pro Tip</p>
                        <p className="text-xs text-slate-300 leading-relaxed">Use the AI chatbot (bottom-right) to navigate features and get instant help.</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
