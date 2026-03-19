'use client';

import { useParams } from 'next/navigation';
import { Gift, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CampaignOffer() {
  const params = useParams();
  const campaignId = params.campaignId as string;

  return (
    <div className="max-w-4xl mx-auto p-8 mt-12 text-center">
      <div className="bg-primary/10 p-6 rounded-full inline-flex mb-8">
        <Gift className="h-16 w-16 text-primary" />
      </div>
      <h1 className="text-4xl font-bold mb-6 tracking-tight">Special Offer: {campaignId.toUpperCase()}</h1>
      <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
        You&apos;ve unlocked an exclusive financial product bundle. Enjoy reduced interest rates and priority processing when you apply today.
      </p>

      <Link 
        href="/apply-loan" 
        className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
      >
        Claim Offer & Apply
        <ArrowRight className="h-5 w-5" />
      </Link>
    </div>
  );
}
