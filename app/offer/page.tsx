import Link from 'next/link';
import {
  Home,
  Car,
  GraduationCap,
  Briefcase,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  IndianRupee,
  Sparkles,
  Clock,
  BadgePercent
} from 'lucide-react';

export default function Offers() {
  const loanProducts = [
    {
      id: 'home',
      icon: <Home className="h-7 w-7" />,
      title: "Home Loans",
      description: "Make your dream home a reality. Flexible financing for purchase, construction, or renovation with minimal documentation.",
      interestRate: "8.25%",
      maxAmount: "₹2 Crore",
      tenure: "Up to 30 years",
      features: ["No prepayment penalties", "Quick disbursement in 7 days", "Balance transfer facility available"],
      color: '#3b82f6',
      emi: '₹7,904/Lakh/Month*'
    },
    {
      id: 'vehicle',
      icon: <Car className="h-7 w-7" />,
      title: "Vehicle Loans",
      description: "Drive home your dream car or two-wheeler. Competitive rates on new and pre-owned vehicles with instant approval.",
      interestRate: "9.5%",
      maxAmount: "₹50 Lakh",
      tenure: "Up to 7 years",
      features: ["Up to 100% on-road financing", "Instant pre-approval via AI", "Covers insurance & registration"],
      color: '#f59e0b',
      emi: '₹1,573/Lakh/Month*'
    },
    {
      id: 'education',
      icon: <GraduationCap className="h-7 w-7" />,
      title: "Education Loans",
      description: "Invest in your future. Cover tuition, hostel, and living expenses at top Indian & international universities.",
      interestRate: "7.5%",
      maxAmount: "₹75 Lakh",
      tenure: "Up to 15 years",
      features: ["Moratorium during study period", "Covers 50+ countries", "Tax benefits under Section 80E"],
      color: '#8b5cf6',
      emi: '₹9,270/Lakh/Year*'
    },
    {
      id: 'personal',
      icon: <CreditCard className="h-7 w-7" />,
      title: "Personal Loans",
      description: "For medical emergencies, weddings, travel, or debt consolidation. Unsecured loans with zero collateral needed.",
      interestRate: "10.5%",
      maxAmount: "₹25 Lakh",
      tenure: "Up to 5 years",
      features: ["No collateral required", "Funds disbursed in 4 hours", "Flexible EMI options"],
      color: '#ec4899',
      emi: '₹2,149/Lakh/Month*'
    },
    {
      id: 'business',
      icon: <Briefcase className="h-7 w-7" />,
      title: "Business Loans",
      description: "Scale your business with working capital, equipment financing, or expansion funding. MSME & startup friendly.",
      interestRate: "11%",
      maxAmount: "₹5 Crore",
      tenure: "Up to 10 years",
      features: ["Collateral-free up to ₹50L", "Dedicated relationship manager", "Mudra & CGTMSE eligible"],
      color: '#06b6d4',
      emi: '₹1,378/Lakh/Month*'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-28 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00b074] rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[128px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-sm text-emerald-300 text-sm font-medium border border-white/10">
            <BadgePercent className="h-4 w-4" />
            Competitive Rates · Instant Approval
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Financial products built<br className="hidden md:block" /> for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b074] via-emerald-300 to-cyan-400">your goals</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed">
            Whether you&apos;re buying a home, starting a business, or funding education,
            QIB offers AI-powered loan products with India&apos;s most competitive rates.
          </p>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loanProducts.map((product, index) => (
            <div
              key={product.id}
              className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 slide-up group relative overflow-hidden flex flex-col h-full"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(to right, ${product.color}, ${product.color}88)` }} />

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300"
                style={{ backgroundColor: `${product.color}12`, color: product.color }}
              >
                {product.icon}
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-2">{product.title}</h3>
              <p className="text-sm text-slate-500 mb-5 flex-grow leading-relaxed">{product.description}</p>

              {/* Rate & Amount Card */}
              <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-100 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">Interest Rate</span>
                  <span className="font-bold text-sm" style={{ color: product.color }}>From {product.interestRate} p.a.</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">Max Amount</span>
                  <span className="font-bold text-sm text-slate-800">{product.maxAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">Tenure</span>
                  <span className="font-bold text-sm text-slate-800">{product.tenure}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-medium">EMI Starting</span>
                  <span className="text-xs font-bold text-[#00b074] flex items-center gap-0.5">
                    {product.emi}
                  </span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-6">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={`/apply-loan?type=${product.id}`}
                className="mt-auto w-full py-3 px-4 rounded-xl font-bold text-sm border-2 text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
                style={{ backgroundColor: product.color, borderColor: product.color }}
              >
                Apply Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 shadow-lg slide-up flex flex-col justify-center relative overflow-hidden" style={{ animationDelay: '400ms' }}>
            <div className="absolute -right-16 -top-16 opacity-5">
              <ShieldCheck className="w-72 h-72" />
            </div>

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <Sparkles className="h-7 w-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black mb-3">Not sure which loan?</h3>
              <p className="mb-6 text-slate-400 leading-relaxed text-sm">
                Our AI-powered advisor analyzes your profile and recommends the best financial product. Talk to our assistant or get started instantly.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#00b074] to-[#008f5d] text-white px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-emerald-900/30 transition-all"
                >
                  Get AI Recommendation
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 2 min process</span>
                  <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> 100% secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
