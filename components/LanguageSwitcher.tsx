'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, X, Check } from 'lucide-react';
import { useLanguage, LANGUAGES } from '@/lib/i18n';

export default function LanguageSwitcher() {
    const { lang, setLang, t } = useLanguage();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const current = LANGUAGES.find(l => l.code === lang);

    return (
        <div ref={ref} className="fixed bottom-5 left-5 z-50">
            {/* Language Panel */}
            {open && (
                <div className="absolute bottom-14 left-0 w-64 bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                        <p className="text-sm font-bold text-slate-900">{t('common.selectLanguage')}</p>
                        <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto py-1">
                        {LANGUAGES.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => { setLang(l.code); setOpen(false); }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all hover:bg-emerald-50 ${lang === l.code ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-700'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-base">{l.native}</span>
                                    <span className="text-xs text-slate-400">{l.name}</span>
                                </div>
                                {lang === l.code && <Check className="h-4 w-4 text-emerald-500" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 ${open ? 'bg-slate-700 text-white shadow-slate-300' : 'bg-white text-slate-700 border border-slate-200 shadow-slate-200 hover:shadow-xl'}`}
                aria-label="Select Language"
                title={current?.native || 'Language'}
            >
                <Globe className="h-5 w-5" />
            </button>
            {!open && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm uppercase">
                    {lang}
                </span>
            )}
        </div>
    );
}
