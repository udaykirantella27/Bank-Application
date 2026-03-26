import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// GET /api/esg — Fetch ESG scores and green investments
export async function GET() {
    try {
        const [scoresRes, investmentsRes] = await Promise.all([
            supabase.from('esg_scores').select('*').order('assessed_at', { ascending: false }).limit(1),
            supabase.from('green_investments').select('*').order('created_at', { ascending: false }),
        ]);

        if (scoresRes.error || investmentsRes.error) {
            return NextResponse.json({ data: getMockESG(), source: 'mock' });
        }

        return NextResponse.json({
            data: {
                latestScore: scoresRes.data?.[0] || getMockESG().latestScore,
                investments: investmentsRes.data?.length ? investmentsRes.data : getMockESG().investments,
            },
            source: 'database',
        });
    } catch {
        return NextResponse.json({ data: getMockESG(), source: 'mock' });
    }
}

function getMockESG() {
    return {
        latestScore: {
            environmental_score: 85,
            social_score: 78,
            governance_score: 83,
            composite_score: 82,
            rating: 'AA',
            co2_offset_tonnes: 12400,
            water_saved_litres: 8200000,
            clean_energy_mw: 45,
            trees_planted: 24000,
        },
        investments: [
            { category: 'Green Bonds', amount: 15600, percentage: 32 },
            { category: 'Renewable Energy', amount: 11700, percentage: 24 },
            { category: 'Sustainable Infra', amount: 8800, percentage: 18 },
            { category: 'Clean Transport', amount: 6800, percentage: 14 },
            { category: 'Carbon Credits', amount: 3900, percentage: 8 },
            { category: 'Other ESG', amount: 2000, percentage: 4 },
        ],
    };
}
