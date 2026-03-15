import Link from 'next/link';
import { ShieldCheck, TrendingUp, HandCoins, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center overflow-hidden px-4 md:px-6 py-24 lg:py-32">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
        <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl xl:-top-6">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
        
        <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-8 fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Next generation banking
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
            Banking that builds <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">your tomorrow</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            Experience seamless banking with QuincyBlessy. Apply for loans in minutes, manage your accounts effortlessly, and watch your wealth grow with our premium financial tools.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
            >
              Get Started
            </Link>
            <Link 
              href="/offer" 
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-all group flex items-center justify-center gap-2"
            >
              View Offers
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Why Choose QuincyBlessy?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We combine modern technology with financial expertise to give you the best banking experience.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="h-8 w-8 text-primary" />,
                title: "Fast Approvals",
                description: "Get your loan applications approved in record time with our automated system."
              },
              {
                icon: <ShieldCheck className="h-8 w-8 text-primary" />,
                title: "Bank-grade Security",
                description: "Your financial data is protected by state-of-the-art encryption and security protocols."
              },
              {
                icon: <HandCoins className="h-8 w-8 text-primary" />,
                title: "Competitive Rates",
                description: "Access some of the best interest rates in the market tailored for your financial profile."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
