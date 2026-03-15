import Link from 'next/link';
import { 
  PercentCircle, 
  Home, 
  Car, 
  GraduationCap, 
  Briefcase, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function Offers() {
  const loanProducts = [
    {
      id: 'home',
      icon: <Home className="h-8 w-8 text-primary" />,
      title: "Home Loans",
      description: "Buy your dream home or renovate your current one with our flexible home financing options.",
      interestRate: "From 4.5% p.a.",
      maxAmount: "$2,000,000",
      features: ["Up to 30 years tenure", "No prepayment penalties", "Quick approval process"]
    },
    {
      id: 'auto',
      icon: <Car className="h-8 w-8 text-primary" />,
      title: "Auto Loans",
      description: "Get behind the wheel faster with our competitive auto loan rates for new and used vehicles.",
      interestRate: "From 5.2% p.a.",
      maxAmount: "$150,000",
      features: ["Up to 100% financing", "Flexible terms up to 7 years", "Instant pre-approval"]
    },
    {
      id: 'education',
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      title: "Education Loans",
      description: "Invest in your future. Cover tuition and living expenses with our low-interest student loans.",
      interestRate: "From 3.8% p.a.",
      maxAmount: "$200,000",
      features: ["Grace period post-graduation", "Co-signer options", "Covers tuition and living"]
    },
    {
      id: 'personal',
      icon: <PercentCircle className="h-8 w-8 text-primary" />,
      title: "Personal Loans",
      description: "Consolidate debt, cover medical expenses, or fund a large purchase with an unsecured loan.",
      interestRate: "From 7.5% p.a.",
      maxAmount: "$50,000",
      features: ["No collateral required", "Fixed monthly payments", "Funds in 24 hours"]
    },
    {
      id: 'business',
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      title: "Business Loans",
      description: "Accelerate your business growth with our tailored commercial financing solutions.",
      interestRate: "From 6.1% p.a.",
      maxAmount: "$5,000,000",
      features: ["Working capital or equipment", "Dedicated relationship manager", "Customizable terms"]
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header Section */}
      <section className="bg-primary/5 py-16 md:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <PercentCircle className="h-4 w-4" />
            Competitive Rates
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Financial products built for <span className="text-primary">your goals</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Whether you're buying a home, starting a business, or consolidating debt, 
            we have the right loan product with industry-leading rates to help you succeed.
          </p>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loanProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 slide-up group relative overflow-hidden flex flex-col h-full"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                {product.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-3">{product.title}</h3>
              <p className="text-muted-foreground mb-6 flex-grow">{product.description}</p>
              
              <div className="bg-muted/50 rounded-xl p-4 mb-6 border border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Interest Rate</span>
                  <span className="font-semibold text-primary">{product.interestRate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Max Amount</span>
                  <span className="font-semibold">{product.maxAmount}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link 
                href="/apply-loan" 
                className="mt-auto w-full py-3.5 px-4 rounded-xl font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all group-hover:shadow-md flex items-center justify-center gap-2"
              >
                Apply Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}

          {/* Value Prop Card */}
          <div className="bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-2xl p-8 shadow-md slide-up flex flex-col justify-center relative overflow-hidden" style={{ animationDelay: '500ms' }}>
            <div className="absolute -right-12 -top-12 opacity-10 blur-3xl">
              <ShieldCheck className="w-64 h-64" />
            </div>
            
            <div className="relative z-10">
              <ShieldCheck className="h-12 w-12 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Need help deciding?</h3>
              <p className="mb-8 text-primary-foreground/90 leading-relaxed">
                Our financial advisors are standing by to help you choose the right product and walk you through the application process securely.
              </p>
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center gap-2 bg-background text-primary px-6 py-3 rounded-xl font-semibold hover:bg-background/90 transition-colors"
              >
                Log In to chat
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
