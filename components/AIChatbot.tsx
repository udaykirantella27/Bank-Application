'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Sparkles, ArrowRight, ThumbsUp, ThumbsDown, RotateCcw, Trash2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface Message {
    id: number;
    role: 'bot' | 'user';
    text: string;
    timestamp: Date;
    isStreaming?: boolean;
    reaction?: 'up' | 'down' | null;
}

const suggestedPrompts = [
    { emoji: '💳', title: 'Loan Status', desc: 'Check your loan details', query: 'What is my loan status?' },
    { emoji: '📊', title: 'Risk Score', desc: 'View AI credit analysis', query: 'Show me my risk score' },
    { emoji: '💸', title: 'Make Payment', desc: 'Payment options & UPI', query: 'How do I make a payment?' },
    { emoji: '🏠', title: 'Home Loan', desc: 'Rates starting 8.25%', query: 'Tell me about home loans' },
    { emoji: '🌱', title: 'ESG Report', desc: 'Sustainability insights', query: 'Show ESG analytics' },
    { emoji: '🤖', title: 'What can you do?', desc: 'See all capabilities', query: 'What can you help me with?' },
];

const botResponses: Record<string, string> = {
    'loan': `Your loan application **LN-2026-0047** is currently **Approved** ✅

**Loan Details:**
• **Amount:** ₹15,00,000
• **Interest Rate:** 8.5% p.a.
• **Monthly EMI:** ₹18,432
• **Next Due Date:** April 5, 2026
• **Outstanding:** ₹12,45,000

Would you like to view your payment history or download a statement? 📄`,

    'risk': `📊 **Your AI Risk Score: 756 / 900**

Here's the breakdown of your credit health:

| Category | Score | Status |
|----------|-------|--------|
| Payment History | 92/100 | ✅ Excellent |
| Credit Utilization | 68/100 | ⚠️ Moderate |
| Account Age | 85/100 | ✅ Good |
| Credit Mix | 74/100 | ✅ Good |

💡 **Pro Tip:** Reducing your credit utilization below 30% could boost your score by ~40 points!

Would you like me to simulate how different actions would affect your score?`,

    'payment': `💸 **Payment Options Available:**

1. **UPI 3.0** — Instant settlement (<0.5 seconds)
2. **IMPS** — Real-time transfer (<2 seconds)
3. **NEFT** — Batch processing (2-4 hours)
4. **Auto-Pay** — Set up recurring EMI payments

To make a payment, head to your **Dashboard → Make Payment**. I can also guide you through setting up auto-pay if you'd like! 🔄`,

    'esg': `🌱 **Your ESG Portfolio Summary**

**Overall Rating: AA (82/100)** — Excellent!

| Metric | Value |
|--------|-------|
| Green Investments | ₹488 Cr across 6 categories |
| CO₂ Offset | 12,400 tonnes/year |
| Water Saved | 8.2M litres/year |
| SDG Goals | Contributing to 4 goals |

You're making a real difference! 🌍 Want to explore more green investment options?`,

    'home_loan': `🏠 **QIB Home Loans**

Get the keys to your dream home with India's best rates!

• **Interest Rate:** Starting from **8.25% p.a.**
• **Loan Amount:** Up to **₹2 Crore**
• **Tenure:** Up to **30 years**
• **EMI Example:** ₹7,904/Lakh/Month*

**Key Benefits:**
✅ No prepayment penalties
✅ Quick disbursement in 7 days
✅ Balance transfer facility
✅ Special rates for women borrowers

Ready to apply? I can help you get started or calculate your EMI! 🏡`,

    'vehicle_loan': `🚗 **QIB Vehicle Loans**

Drive home your dream car today!

• **Interest Rate:** Starting from **9.5% p.a.**
• **Loan Amount:** Up to **₹50 Lakh**
• **Tenure:** Up to **7 years**

**Key Benefits:**
✅ Up to 100% on-road financing
✅ Instant pre-approval via AI
✅ Covers insurance & registration
✅ New & pre-owned vehicles

Want me to calculate your EMI or start an application? 🚙`,

    'education_loan': `📚 **QIB Education Loans**

Invest in your future without financial stress!

• **Interest Rate:** Starting from **7.5% p.a.**
• **Loan Amount:** Up to **₹75 Lakh**
• **Tenure:** Up to **15 years**

**Key Benefits:**
✅ Moratorium during study period
✅ Covers 50+ countries worldwide
✅ Tax benefits under Section 80E
✅ Simple documentation

Studying abroad or in India? Let me help you find the right plan! 🎓`,

    'personal_loan': `💳 **QIB Personal Loans**

Quick funds for any need — zero collateral required!

• **Interest Rate:** Starting from **10.5% p.a.**
• **Loan Amount:** Up to **₹25 Lakh**
• **Tenure:** Up to **5 years**
• **Disbursement:** In **4 hours!**

Perfect for medical emergencies, weddings, travel, or debt consolidation. Shall I start an application? 📋`,

    'business_loan': `💼 **QIB Business Loans**

Scale your vision with the right funding!

• **Interest Rate:** Starting from **11% p.a.**
• **Loan Amount:** Up to **₹5 Crore**
• **Collateral-free:** Up to **₹50 Lakh**
• **Tenure:** Up to **10 years**

**Key Benefits:**
✅ MSME & startup friendly
✅ Dedicated relationship manager
✅ Mudra & CGTMSE eligible

Ready to grow your business? Let's get started! 🚀`,

    'help': `👋 I'm **QIB AI Assistant** — your intelligent banking companion!

Here's everything I can help with:

💳 **Loans** — Status, applications, EMI calculations
📊 **Credit** — Risk scores, credit health analysis
💸 **Payments** — UPI, IMPS, NEFT, auto-pay setup
🌱 **ESG** — Sustainability reports & green investing
🏠 **Products** — Home, vehicle, education, personal & business loans
🔒 **Security** — Account protection & fraud alerts
📋 **Documents** — Statements, certificates & reports

Just ask me anything or tap a suggestion below! I'm here 24/7 🤖`,

    'hello': `Hey there! 👋 Welcome to **QIB Banking**!

I'm your AI-powered banking assistant. Think of me as your personal banker who's available 24/7.

Here are some things I can help you with right now:
• Check your loan status & EMI details
• View your AI-powered risk score
• Explore our loan products
• Make payments & transfers
• Get ESG & sustainability reports

What would you like to do today? 😊`,

    'interest': `📐 **EMI Calculator**

Tell me the loan amount, interest rate, and tenure, and I'll calculate your EMI instantly!

**Quick Examples:**
| Loan Amount | Rate | Tenure | EMI |
|-------------|------|--------|-----|
| ₹10 Lakh | 8.25% | 20 yrs | ₹8,523 |
| ₹25 Lakh | 9.5% | 7 yrs | ₹3,933 |
| ₹50 Lakh | 8.25% | 30 yrs | ₹37,618 |

Just tell me your numbers and I'll crunch them! 🔢`,

    'branch': `📍 **QIB Branch & ATM Locator**

We have **500+ branches** and **2,000+ ATMs** across India!

**Nearest Branches (based on popular areas):**
1. 🏛 Mumbai — Bandra West, Andheri, Fort
2. 🏛 Delhi — Connaught Place, Saket, Dwarka
3. 🏛 Bangalore — Koramangala, Whitefield, MG Road
4. 🏛 Hyderabad — Banjara Hills, HITEC City, Jubilee Hills

For your exact nearest branch, share your city or PIN code! 🗺️`,

    'account': `🔐 **Account Services**

Here's what I can help with regarding your account:

• 📊 **Balance Inquiry** — Check your latest balance
• 📋 **Statement Download** — Last 3/6/12 months
• 🔒 **Security Settings** — 2FA, login alerts
• 💳 **Card Management** — Block, unblock, limit changes
• 📱 **Mobile Banking** — Setup & troubleshooting
• 🔗 **Linked Accounts** — Manage beneficiaries

What do you need help with? 🤔`,

    'default': `I appreciate your question! While I'm getting smarter every day, let me point you in the right direction 🧭

Here's what I'm best at helping with:
• 💳 Loan status & applications
• 📊 AI risk score analysis
• 💸 Payment processing & options
• 🏠 Home, vehicle, education & business loans
• 🌱 ESG analytics & green investing
• 📍 Branch & ATM locations
• 🔐 Account services

Could you rephrase your question or try one of the suggestions below? I want to make sure I give you the best answer! 💪`,
};

function getResponse(input: string): string {
    const lower = input.toLowerCase();
    if (lower.includes('home') && (lower.includes('loan') || lower.includes('housing'))) return botResponses['home_loan'];
    if (lower.includes('vehicle') || lower.includes('car') || lower.includes('bike') || lower.includes('auto')) return botResponses['vehicle_loan'];
    if (lower.includes('education') || lower.includes('study') || lower.includes('university') || lower.includes('college')) return botResponses['education_loan'];
    if (lower.includes('personal') && lower.includes('loan')) return botResponses['personal_loan'];
    if (lower.includes('business') || lower.includes('msme') || lower.includes('startup')) return botResponses['business_loan'];
    if (lower.includes('loan') || lower.includes('emi') || lower.includes('application')) return botResponses['loan'];
    if (lower.includes('risk') || lower.includes('score') || lower.includes('credit') || lower.includes('cibil')) return botResponses['risk'];
    if (lower.includes('pay') || lower.includes('transfer') || lower.includes('upi') || lower.includes('neft')) return botResponses['payment'];
    if (lower.includes('esg') || lower.includes('green') || lower.includes('sustain') || lower.includes('carbon')) return botResponses['esg'];
    if (lower.includes('interest') || lower.includes('emi calc') || lower.includes('calculate')) return botResponses['interest'];
    if (lower.includes('branch') || lower.includes('atm') || lower.includes('location') || lower.includes('near')) return botResponses['branch'];
    if (lower.includes('account') || lower.includes('balance') || lower.includes('statement') || lower.includes('card')) return botResponses['account'];
    if (lower.includes('help') || lower.includes('support') || lower.includes('assist') || lower.includes('what can')) return botResponses['help'];
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('good') || lower.includes('thanks') || lower.includes('thank')) return botResponses['hello'];
    return botResponses['default'];
}

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [unread, setUnread] = useState(1);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { t } = useLanguage();

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, scrollToBottom]);

    useEffect(() => {
        if (isOpen) {
            setUnread(0);
            setTimeout(() => textareaRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Auto-resize textarea
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        const ta = e.target;
        ta.style.height = 'auto';
        ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    };

    // Streaming text effect
    const streamResponse = async (fullText: string, messageId: number) => {
        const words = fullText.split(' ');
        let accumulated = '';

        for (let i = 0; i < words.length; i++) {
            accumulated += (i === 0 ? '' : ' ') + words[i];
            const current = accumulated;
            setMessages(prev =>
                prev.map(m => m.id === messageId ? { ...m, text: current, isStreaming: true } : m)
            );
            await new Promise(r => setTimeout(r, 15 + Math.random() * 25));
        }

        setMessages(prev =>
            prev.map(m => m.id === messageId ? { ...m, isStreaming: false } : m)
        );
    };

    const sendMessage = async (text: string) => {
        if (!text.trim() || isTyping) return;

        const userMsg: Message = { id: Date.now(), role: 'user', text: text.trim(), timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
        setIsTyping(true);

        // Simulate thinking
        await new Promise(r => setTimeout(r, 400 + Math.random() * 400));

        const responseText = getResponse(text);
        const botId = Date.now() + 1;
        const botMsg: Message = { id: botId, role: 'bot', text: '', timestamp: new Date(), isStreaming: true };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);

        await streamResponse(responseText, botId);

        if (!isOpen) setUnread(prev => prev + 1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const handleReaction = (msgId: number, reaction: 'up' | 'down') => {
        setMessages(prev =>
            prev.map(m => m.id === msgId ? { ...m, reaction: m.reaction === reaction ? null : reaction } : m)
        );
    };

    const clearChat = () => {
        setMessages([]);
    };

    // Render markdown-like bold text and line breaks
    const renderText = (text: string) => {
        return text.split('\n').map((line, i) => (
            <span key={i}>
                {line.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                })}
                {i < text.split('\n').length - 1 && <br />}
            </span>
        ));
    };

    const showWelcomeScreen = messages.length === 0;

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-container" role="dialog" aria-label="QIB AI Assistant">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-5 py-3.5 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">{t('chat.title')}</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[11px] text-slate-400">{t('chat.online')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {messages.length > 0 && (
                                <button
                                    onClick={clearChat}
                                    className="text-slate-500 hover:text-slate-300 transition-colors p-2 rounded-lg hover:bg-white/5"
                                    aria-label="Clear chat"
                                    title="Clear conversation"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                                aria-label="Close chat"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto">
                        {showWelcomeScreen ? (
                            /* Welcome Screen */
                            <div className="h-full flex flex-col items-center justify-center px-5 py-8">
                                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-5 shadow-lg shadow-emerald-200/50">
                                    <Sparkles className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">{t('chat.greeting')}</h3>
                                <p className="text-sm text-slate-500 text-center mb-8 max-w-[280px] leading-relaxed">
                                    {t('chat.description')}
                                </p>

                                <div className="w-full grid grid-cols-2 gap-2 max-w-[360px]">
                                    {suggestedPrompts.map((prompt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => sendMessage(prompt.query)}
                                            className="text-left p-3.5 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 hover:border-emerald-200 hover:shadow-md transition-all group active:scale-[0.97]"
                                        >
                                            <span className="text-lg mb-1 block">{prompt.emoji}</span>
                                            <p className="text-[13px] font-bold text-slate-900 group-hover:text-[#00b074] transition-colors">{prompt.title}</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">{prompt.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Chat Messages */
                            <div className="px-4 py-4 space-y-5">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} chatbot-msg-enter`}>
                                        {msg.role === 'bot' && (
                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                                <Sparkles className="h-4 w-4 text-white" />
                                            </div>
                                        )}
                                        <div className="max-w-[85%] sm:max-w-[80%]">
                                            <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${msg.role === 'user'
                                                ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-br-md shadow-sm'
                                                : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-md'
                                                }`}>
                                                {renderText(msg.text)}
                                                {msg.isStreaming && (
                                                    <span className="inline-block w-0.5 h-4 bg-emerald-500 ml-0.5 animate-pulse" />
                                                )}
                                            </div>

                                            {/* Message actions for bot messages */}
                                            {msg.role === 'bot' && !msg.isStreaming && msg.text && (
                                                <div className="flex items-center gap-1 mt-1.5 pl-1">
                                                    <button
                                                        onClick={() => handleReaction(msg.id, 'up')}
                                                        className={`p-1 rounded-md transition-all ${msg.reaction === 'up' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'}`}
                                                        aria-label="Helpful"
                                                    >
                                                        <ThumbsUp className="h-3 w-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReaction(msg.id, 'down')}
                                                        className={`p-1 rounded-md transition-all ${msg.reaction === 'down' ? 'bg-red-50 text-red-500' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'}`}
                                                        aria-label="Not helpful"
                                                    >
                                                        <ThumbsDown className="h-3 w-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => sendMessage(messages.filter(m => m.role === 'user').pop()?.text || 'help')}
                                                        className="p-1 rounded-md text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-all"
                                                        aria-label="Regenerate"
                                                    >
                                                        <RotateCcw className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex gap-2.5 chatbot-msg-enter">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 shadow-sm">
                                            <Sparkles className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="bg-white border border-slate-100 shadow-sm px-4 py-3.5 rounded-2xl rounded-bl-md">
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-1">
                                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                </div>
                                                <span className="text-[11px] text-slate-400">Thinking...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Quick Actions (contextual) */}
                    {messages.length > 0 && messages.length < 6 && (
                        <div className="px-3 py-2 border-t border-slate-100 bg-white/80 backdrop-blur-sm shrink-0">
                            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                                {suggestedPrompts.slice(0, 4).map((prompt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(prompt.query)}
                                        disabled={isTyping}
                                        className="text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 px-3 py-1.5 rounded-full whitespace-nowrap transition-all border border-slate-100 hover:border-emerald-200 flex items-center gap-1.5 disabled:opacity-40 active:scale-95"
                                    >
                                        <span>{prompt.emoji}</span>
                                        {prompt.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="px-3 sm:px-4 py-3 border-t border-slate-100 bg-white shrink-0">
                        <div className="flex items-end gap-2 bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-100 transition-all px-3 py-1.5">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={handleTextareaChange}
                                onKeyDown={handleKeyDown}
                                placeholder={t('chat.placeholder')}
                                rows={1}
                                className="flex-1 text-sm text-slate-900 placeholder-slate-400 outline-none bg-transparent resize-none py-2 max-h-[120px] leading-relaxed"
                                aria-label="Type your message"
                                style={{ height: 'auto' }}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#00b074] to-[#008f5d] hover:shadow-lg hover:shadow-emerald-200 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0 mb-0.5 active:scale-90"
                                aria-label="Send message"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400 text-center mt-2">QIB AI may produce inaccurate info. Verify details with your branch.</p>
                    </form>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-5 right-5 z-50 transition-all hover:scale-105 active:scale-95 ${isOpen
                    ? 'w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-800 shadow-lg shadow-slate-300'
                    : 'w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-xl shadow-emerald-200 chatbot-pulse'
                    }`}
                aria-label={isOpen ? 'Close chat' : 'Open QIB AI Assistant'}
            >
                {isOpen ? (
                    <X className="h-5 w-5 text-white mx-auto" />
                ) : (
                    <div className="relative flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-white" />
                        {unread > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                {unread}
                            </span>
                        )}
                    </div>
                )}
            </button>
        </>
    );
}
