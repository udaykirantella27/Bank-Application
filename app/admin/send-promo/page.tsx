'use client';

import { useState } from 'react';
import { Send, Mail, Phone, IndianRupee, Loader2, CheckCircle2, AlertCircle, Home, Car, GraduationCap, Briefcase, CreditCard, Sparkles, ArrowRight, Copy, Link as LinkIcon } from 'lucide-react';

const loanTypes = [
    { value: 'home', label: 'Home Loan', icon: Home, rate: '8.25%', maxAmount: '₹2 Crore' },
    { value: 'vehicle', label: 'Vehicle Loan', icon: Car, rate: '9.5%', maxAmount: '₹50 Lakh' },
    { value: 'education', label: 'Education Loan', icon: GraduationCap, rate: '7.5%', maxAmount: '₹75 Lakh' },
    { value: 'personal', label: 'Personal Loan', icon: CreditCard, rate: '10.5%', maxAmount: '₹25 Lakh' },
    { value: 'business', label: 'Business Loan', icon: Briefcase, rate: '11%', maxAmount: '₹5 Crore' },
];

export default function SendPromoPage() {
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        loanType: 'home',
        amount: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [copiedLink, setCopiedLink] = useState(false);

    const selectedLoan = loanTypes.find(l => l.value === formData.loanType);
    const promoLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/apply-loan?ref=promo&type=${formData.loanType}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(promoLink);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const res = await fetch('/api/sendPromo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    phone: formData.phone,
                    amount: formData.amount,
                    loanType: formData.loanType,
                    message: formData.message,
                    promoLink,
                }),
            });

            if (res.ok) {
                setResult({ type: 'success', text: `Promotional offer sent successfully to ${formData.email}!` });
                setFormData({ email: '', phone: '', loanType: 'home', amount: '', message: '' });
            } else {
                const data = await res.json();
                setResult({ type: 'error', text: data.error || 'Failed to send promotional offer.' });
            }
        } catch {
            setResult({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 lg:p-12 max-w-5xl fade-in">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                        <Send className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Send Promotional Offer</h1>
                        <p className="text-slate-500 text-sm">Send personalized loan offers to customers via email</p>
                    </div>
                </div>
            </div>

            {/* Result Toast */}
            {result && (
                <div className={`mb-6 px-5 py-4 rounded-xl flex items-center gap-3 text-sm font-medium slide-up ${result.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {result.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                    {result.text}
                </div>
            )}

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recipient Details</h2>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    <Mail className="h-3.5 w-3.5 inline mr-1.5 text-slate-400" />
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="customer@email.com"
                                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00b074]/20 focus:border-[#00b074] outline-none transition-all text-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    <Phone className="h-3.5 w-3.5 inline mr-1.5 text-slate-400" />
                                    Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00b074]/20 focus:border-[#00b074] outline-none transition-all text-slate-900"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Offer Configuration</h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Loan Product</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {loanTypes.map((lt) => {
                                    const Icon = lt.icon;
                                    const isSelected = formData.loanType === lt.value;
                                    return (
                                        <button
                                            key={lt.value}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, loanType: lt.value }))}
                                            className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all border ${isSelected
                                                ? 'bg-[#00b074] text-white border-[#00b074] shadow-md shadow-emerald-200'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-[#00b074]/40 hover:bg-emerald-50/50'
                                                }`}
                                        >
                                            <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                                            {lt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    <IndianRupee className="h-3.5 w-3.5 inline mr-1.5 text-slate-400" />
                                    Pre-approved Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="e.g. 1500000"
                                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00b074]/20 focus:border-[#00b074] outline-none transition-all text-slate-900"
                                />
                            </div>
                            <div className="flex flex-col justify-end">
                                {selectedLoan && (
                                    <div className="px-4 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-500">
                                        <span className="font-bold text-slate-700">{selectedLoan.label}</span> · Rate from {selectedLoan.rate} · Up to {selectedLoan.maxAmount}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Custom Message (optional)</label>
                            <textarea
                                name="message"
                                rows={3}
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Add a personalized message for the customer..."
                                className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00b074]/20 focus:border-[#00b074] outline-none transition-all resize-none text-slate-900"
                            />
                        </div>
                    </div>

                    {/* Promo Link */}
                    <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl border border-violet-100 p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <LinkIcon className="h-4 w-4 text-violet-500" />
                            <span className="text-sm font-bold text-violet-800">Application Link</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 text-xs bg-white/80 px-3 py-2 rounded-lg text-violet-600 border border-violet-200 truncate">
                                {promoLink}
                            </code>
                            <button type="button" onClick={handleCopyLink} className="p-2 rounded-lg bg-white border border-violet-200 hover:bg-violet-100 transition-colors">
                                {copiedLink ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-violet-500" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !formData.email}
                        className="w-full py-3.5 bg-gradient-to-r from-[#00b074] to-[#008f5d] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <><Loader2 className="h-5 w-5 animate-spin" /> Sending Offer...</>
                        ) : (
                            <><Send className="h-4 w-4" /> Send Promotional Offer <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </form>

                {/* Right Panel — Preview */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-4 w-4 text-amber-500" />
                            <h3 className="text-sm font-bold text-slate-900">Email Preview</h3>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-5 space-y-4 text-sm">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00b074] to-[#008f5d] flex items-center justify-center">
                                    <span className="text-white font-black text-sm">Q</span>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">QIB — Quantum Intelligent Banking</p>
                                    <p className="text-xs text-slate-400">noreply@qib-bank.com</p>
                                </div>
                            </div>

                            <p className="text-slate-700">Dear Customer,</p>
                            <p className="text-slate-600 leading-relaxed">
                                You&apos;ve been pre-approved for a <strong className="text-slate-900">{selectedLoan?.label || 'Loan'}</strong>
                                {formData.amount && <> of up to <strong className="text-[#00b074]">₹{Number(formData.amount).toLocaleString('en-IN')}</strong></>}
                                {selectedLoan && <> at an interest rate starting from <strong>{selectedLoan.rate} p.a.</strong></>}
                            </p>
                            {formData.message && (
                                <p className="text-slate-600 italic border-l-2 border-[#00b074] pl-3">&ldquo;{formData.message}&rdquo;</p>
                            )}
                            <div className="bg-[#00b074] text-white text-center py-2.5 rounded-lg font-bold text-sm cursor-default">
                                Apply Now →
                            </div>
                            <p className="text-[10px] text-slate-400 text-center">Terms & conditions apply. Subject to eligibility verification.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
