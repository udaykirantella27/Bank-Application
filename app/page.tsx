'use client';

import Link from 'next/link';
import {
  ShieldCheck, TrendingUp, HandCoins, ArrowRight, Sparkles, Lock, BarChart3,
  Wallet, PiggyBank, Landmark, CreditCard, Smartphone, Users, Clock,
  MapPin, Star, CheckCircle2, Phone, Mail, ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

// services, stats, steps moved inside component to access t()



const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Home Loan Customer',
    city: 'Mumbai',
    rating: 5,
    text: 'Got my home loan approved in just 3 hours! The AI recommendation was spot-on. Best interest rate I found anywhere.',
    avatar: 'PS',
    color: '#ec4899',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Business Loan Customer',
    city: 'Bangalore',
    rating: 5,
    text: 'QIB\'s business loan helped me scale my startup. The entire process was digital — zero paperwork. The AI assistant was incredibly helpful.',
    avatar: 'RK',
    color: '#3b82f6',
  },
  {
    name: 'Anisha Devi',
    role: 'Savings Account Holder',
    city: 'Delhi',
    rating: 5,
    text: 'The 7.5% savings rate is unbeatable. Their mobile banking app is smooth and the UPI payments are instant. Loving it!',
    avatar: 'AD',
    color: '#00b074',
  },
];

export default function Home() {
  const { t } = useLanguage();

  const services = [
    { icon: <PiggyBank className="h-7 w-7" />, title: t('svc.savings'), description: t('svc.savingsDesc'), color: '#00b074', highlight: t('svc.savingsHighlight') },
    { icon: <Landmark className="h-7 w-7" />, title: t('svc.fd'), description: t('svc.fdDesc'), color: '#3b82f6', highlight: t('svc.fdHighlight') },
    { icon: <Wallet className="h-7 w-7" />, title: t('svc.loans'), description: t('svc.loansDesc'), color: '#8b5cf6', highlight: t('svc.loansHighlight') },
    { icon: <Smartphone className="h-7 w-7" />, title: t('svc.payments'), description: t('svc.paymentsDesc'), color: '#f59e0b', highlight: t('svc.paymentsHighlight') },
    { icon: <CreditCard className="h-7 w-7" />, title: t('svc.cards'), description: t('svc.cardsDesc'), color: '#ec4899', highlight: t('svc.cardsHighlight') },
    { icon: <ShieldCheck className="h-7 w-7" />, title: t('svc.insurance'), description: t('svc.insuranceDesc'), color: '#06b6d4', highlight: t('svc.insuranceHighlight') },
  ];

  const stats = [
    { value: '5M+', label: t('stat.customers'), icon: <Users className="h-5 w-5" /> },
    { value: '₹10,000 Cr+', label: t('stat.disbursed'), icon: <TrendingUp className="h-5 w-5" /> },
    { value: '99.97%', label: t('stat.uptime'), icon: <BarChart3 className="h-5 w-5" /> },
    { value: '500+', label: t('stat.branches'), icon: <MapPin className="h-5 w-5" /> },
  ];

  const steps = [
    { step: '01', title: t('home.step1'), description: t('home.step1Desc'), color: '#00b074' },
    { step: '02', title: t('home.step2'), description: t('home.step2Desc'), color: '#3b82f6' },
    { step: '03', title: t('home.step3'), description: t('home.step3Desc'), color: '#8b5cf6' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center overflow-hidden px-4 md:px-6 py-16 sm:py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
        <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl xl:-top-6">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#00b074] to-[#06b6d4] opacity-20" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-[#00b074] text-xs sm:text-sm font-semibold border border-emerald-100">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {t('hero.badge')}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
            {t('hero.title1')} <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b074] via-[#06b6d4] to-[#8b5cf6]">{t('hero.title2')}</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-500 leading-relaxed px-2">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00b074] to-[#008f5d] text-white font-semibold hover:shadow-lg hover:shadow-emerald-200 transition-all hover:-translate-y-0.5 text-center"
            >
              {t('hero.openAccount')}
            </Link>
            <Link
              href="/offer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-all group flex items-center justify-center gap-2"
            >
              {t('hero.exploreLoans')}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 sm:pt-6">
            {[
              { icon: <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />, text: t('trust.security') },
              { icon: <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />, text: t('trust.uptime') },
              { icon: <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />, text: t('trust.rbi') },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-slate-400">
                {badge.icon}
                {badge.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center py-4 slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-emerald-400 mb-3">
                  {stat.icon}
                </div>
                <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-[#00b074] text-xs font-semibold border border-emerald-100 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              {t('home.servicesTag')}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
              {t('home.servicesTitle')}
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
              {t('home.servicesSubtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {services.map((service, i) => (
              <div
                key={i}
                className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1 group slide-up relative overflow-hidden"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Highlight badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${service.color}12`, color: service.color }}
                  >
                    {service.highlight}
                  </span>
                </div>

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${service.color}12`, color: service.color }}
                >
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#00b074] transition-colors">{service.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{service.description}</p>
                <div className="flex items-center gap-1 mt-4 text-sm font-semibold text-[#00b074] opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('home.learnMore')} <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
              {t('home.stepsTitle')}<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b074] to-[#06b6d4]">{t('home.simpleSteps')}</span>
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">{t('home.noPaperwork')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all slide-up group" style={{ animationDelay: `${i * 120}ms` }}>
                {/* Step number */}
                <div
                  className="text-6xl sm:text-7xl font-black opacity-5 absolute top-4 right-6 select-none"
                  style={{ color: step.color }}
                >
                  {step.step}
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white font-black text-lg"
                  style={{ backgroundColor: step.color }}
                >
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#00b074] transition-colors">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm sm:text-base">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-slate-300">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00b074] to-[#008f5d] text-white font-semibold hover:shadow-lg hover:shadow-emerald-200 transition-all hover:-translate-y-0.5"
            >
              {t('home.openFreeAccount')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-50 to-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
              {t('home.testimonialsTitle1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b074] to-[#06b6d4]">{t('home.testimonialsTitle2')}</span> {t('home.testimonialsTitle3')}
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">{t('home.testimonialsDesc')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }, (_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed mb-6 text-sm sm:text-base">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role} · {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose QIB */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-4">{t('home.whyChooseTitle')}</h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">{t('home.whyChooseDesc')}</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
            {[
              {
                icon: <TrendingUp className="h-8 w-8 text-[#00b074]" />,
                title: t('home.whyApprovalTitle'),
                description: t('home.whyApprovalDesc')
              },
              {
                icon: <ShieldCheck className="h-8 w-8 text-[#00b074]" />,
                title: t('home.whySecurityTitle'),
                description: t('home.whySecurityDesc')
              },
              {
                icon: <HandCoins className="h-8 w-8 text-[#00b074]" />,
                title: t('home.whyRatesTitle'),
                description: t('home.whyRatesDesc')
              }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-all slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="bg-emerald-50 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-5 sm:mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-emerald-300 text-xs font-medium mb-4">
                <Smartphone className="h-3.5 w-3.5" />
                {t('home.ctaMobileTag')}
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                {t('home.ctaMobileTitle1')}<br className="hidden sm:block" /> {t('home.ctaMobileTitle2')}
              </h2>
              <p className="text-slate-400 text-base sm:text-lg max-w-lg leading-relaxed mb-6">
                {t('home.ctaMobileDesc')}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
                {[
                  { text: t('home.ctaItem1'), icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" /> },
                  { text: t('home.ctaItem2'), icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" /> },
                  { text: t('home.ctaItem3'), icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" /> },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    {item.icon}
                    {item.text}
                  </div>
                ))}
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00b074] to-[#008f5d] text-white font-semibold hover:shadow-lg hover:shadow-emerald-900/30 transition-all"
              >
                {t('home.ctaBtn')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Phone mockup visual */}
            <div className="flex-shrink-0 relative">
              <div className="w-[200px] sm:w-[240px] h-[400px] sm:h-[480px] bg-gradient-to-br from-slate-700 to-slate-800 rounded-[2rem] sm:rounded-[2.5rem] border-4 border-slate-600 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-slate-900 rounded-b-2xl" />
                <div className="p-4 pt-10 h-full flex flex-col">
                  <div className="text-center mb-4">
                    <p className="text-sm font-bold text-white">QIB Banking</p>
                    <p className="text-[10px] text-slate-400">Welcome back!</p>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-3 mb-3 border border-emerald-500/20">
                    <p className="text-[10px] text-slate-400">Available Balance</p>
                    <p className="text-lg font-black text-white">₹2,45,890</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                      <div className="text-[10px] mb-1">💸</div>
                      <p className="text-[8px] text-slate-300">Pay</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                      <div className="text-[10px] mb-1">📊</div>
                      <p className="text-[8px] text-slate-300">Invest</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                      <div className="text-[10px] mb-1">🏦</div>
                      <p className="text-[8px] text-slate-300">Loans</p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {['Salary Credit +₹85,000', 'EMI Debit -₹18,432', 'UPI Transfer -₹2,500'].map((t, i) => (
                      <div key={i} className="bg-slate-700/30 rounded-lg px-3 py-2 flex items-center justify-between">
                        <p className="text-[9px] text-slate-300 truncate">{t}</p>
                        <div className={`w-1.5 h-1.5 rounded-full ${t.includes('+') ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-[3rem] blur-xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Footer CTA */}
      <section id="contact" className="py-16 sm:py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-3xl p-8 sm:p-12 border border-slate-100">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-4">{t('home.contactTitle')}</h2>
              <p className="text-slate-500 mb-8 text-sm sm:text-base">{t('home.contactDesc')}</p>
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm text-center">
                  <Phone className="h-6 w-6 text-[#00b074] mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-900">1800-QIB-BANK</p>
                  <p className="text-xs text-slate-500">{t('home.contactTollFree')}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm text-center">
                  <Mail className="h-6 w-6 text-[#00b074] mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-900">help@qib.bank</p>
                  <p className="text-xs text-slate-500">{t('home.contactEmailDesc')}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm text-center">
                  <Clock className="h-6 w-6 text-[#00b074] mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-900">AI Chat 24/7</p>
                  <p className="text-xs text-slate-500">{t('home.contactAiDesc')}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">{t('home.footerLegal')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
