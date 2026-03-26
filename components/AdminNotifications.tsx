'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, X, IndianRupee, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface Notification {
    id: string;
    name: string;
    email: string;
    loan_amount: number;
    loan_purpose: string;
    status: string;
    created_at: string;
}

export default function AdminNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showPanel, setShowPanel] = useState(false);
    const [toasts, setToasts] = useState<Notification[]>([]);
    const knownIdsRef = useRef<Set<string>>(new Set());
    const initialLoadRef = useRef(true);
    const panelRef = useRef<HTMLDivElement>(null);

    const fetchApplications = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/applications?limit=10');
            if (!res.ok) return;
            const data = await res.json();
            const apps: Notification[] = data.applications || [];

            // Detect new applications
            const newApps = apps.filter(a => !knownIdsRef.current.has(a.id));

            // Update known IDs
            apps.forEach(a => knownIdsRef.current.add(a.id));

            // Only show toasts after first load
            if (!initialLoadRef.current && newApps.length > 0) {
                setToasts(prev => [...newApps, ...prev].slice(0, 3));

                // Auto-dismiss toasts after 8 seconds
                setTimeout(() => {
                    setToasts(prev => prev.filter(t => !newApps.some(n => n.id === t.id)));
                }, 8000);
            }

            initialLoadRef.current = false;
            setNotifications(apps.filter(a => a.status === 'pending'));
        } catch (err) {
            console.error('Notification fetch failed', err);
        }
    }, []);

    useEffect(() => {
        fetchApplications();
        const interval = setInterval(fetchApplications, 15000);
        return () => clearInterval(interval);
    }, [fetchApplications]);

    // Close panel on outside click
    useEffect(() => {
        const handle = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) setShowPanel(false);
        };
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, []);

    const dismissToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const pendingCount = notifications.length;
    const purposeLabels: Record<string, string> = {
        home: 'Home Loan', auto: 'Vehicle Loan', vehicle: 'Vehicle Loan',
        education: 'Education Loan', personal: 'Personal Loan', business: 'Business Loan',
    };

    return (
        <>
            {/* Toast Notifications */}
            <div className="fixed top-20 right-5 z-[200] flex flex-col gap-3 w-[360px]">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-emerald-100 p-4 animate-in slide-in-from-right duration-300"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                                    <Bell className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">🔔 New Loan Application!</p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        <span className="font-semibold text-slate-700">{toast.name || toast.email}</span> applied for a{' '}
                                        <span className="font-semibold">{purposeLabels[toast.loan_purpose] || 'Loan'}</span>
                                    </p>
                                    <p className="text-sm font-black text-emerald-600 mt-1 flex items-center gap-0.5">
                                        <IndianRupee className="h-3.5 w-3.5" />
                                        {Number(toast.loan_amount).toLocaleString('en-IN')}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => dismissToast(toast.id)} className="text-slate-400 hover:text-slate-600 p-1">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <Link
                            href="/admin/applications"
                            onClick={() => dismissToast(toast.id)}
                            className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-[#00b074] to-[#008f5d] rounded-xl py-2 hover:shadow-lg transition-all"
                        >
                            Review Application <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                ))}
            </div>

            {/* Bell Icon in Admin Area */}
            <div ref={panelRef} className="relative">
                <button
                    onClick={() => setShowPanel(!showPanel)}
                    className="relative w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 hover:shadow-md transition-all"
                >
                    <Bell className="h-5 w-5" />
                    {pendingCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-sm">
                            {pendingCount > 9 ? '9+' : pendingCount}
                        </span>
                    )}
                </button>

                {/* Dropdown Panel */}
                {showPanel && (
                    <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                            <p className="text-sm font-bold text-slate-900">Pending Applications</p>
                            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold">{pendingCount}</span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-sm text-slate-400">No pending applications</div>
                            ) : (
                                notifications.map((n) => (
                                    <Link
                                        key={n.id}
                                        href="/admin/applications"
                                        onClick={() => setShowPanel(false)}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                                            <Clock className="h-4 w-4 text-amber-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 truncate">{n.name || n.email || 'Customer'}</p>
                                            <p className="text-xs text-slate-400 capitalize">{purposeLabels[n.loan_purpose] || n.loan_purpose} · ₹{Number(n.loan_amount).toLocaleString('en-IN')}</p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                        <Link
                            href="/admin/applications"
                            onClick={() => setShowPanel(false)}
                            className="block text-center text-xs font-bold text-emerald-600 py-3 border-t border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                            View All Applications →
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
