import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// GET /api/risk-scoring — Fetch risk assessments
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    try {
        let query = supabase
            .from('risk_assessments')
            .select('*')
            .order('assessed_at', { ascending: false })
            .limit(20);

        if (userId) {
            query = query.eq('user_id', userId);
        }

        const { data, error } = await query;

        if (error) {
            // Fallback to mock data if table doesn't exist yet
            return NextResponse.json({
                data: getMockAssessments(),
                source: 'mock',
            });
        }

        return NextResponse.json({ data, source: 'database' });
    } catch {
        return NextResponse.json({ data: getMockAssessments(), source: 'mock' });
    }
}

// POST /api/risk-scoring — Create a new risk assessment
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        // Simulate AI risk scoring
        const assessment = {
            user_id: userId,
            credit_score: Math.floor(Math.random() * 300) + 600,
            risk_level: 'low' as string,
            payment_history_score: Math.floor(Math.random() * 20) + 80,
            credit_utilization_score: Math.floor(Math.random() * 40) + 50,
            account_age_score: Math.floor(Math.random() * 20) + 75,
            credit_mix_score: Math.floor(Math.random() * 30) + 60,
            recent_inquiries_score: Math.floor(Math.random() * 40) + 50,
            model_name: 'xgboost-v3.2.1',
            model_confidence: parseFloat((Math.random() * 10 + 85).toFixed(2)),
        };

        if (assessment.credit_score < 650) assessment.risk_level = 'high';
        else if (assessment.credit_score < 750) assessment.risk_level = 'medium';

        const { data, error } = await supabase
            .from('risk_assessments')
            .insert(assessment)
            .select()
            .single();

        if (error) {
            // Return the simulated assessment even if DB fails
            return NextResponse.json({ data: assessment, source: 'simulated' });
        }

        return NextResponse.json({ data, source: 'database' });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

function getMockAssessments() {
    return [
        { id: 'rsk-1', credit_score: 812, risk_level: 'low', model_confidence: 94.2, assessed_at: new Date().toISOString() },
        { id: 'rsk-2', credit_score: 645, risk_level: 'medium', model_confidence: 88.7, assessed_at: new Date().toISOString() },
        { id: 'rsk-3', credit_score: 490, risk_level: 'high', model_confidence: 91.3, assessed_at: new Date().toISOString() },
        { id: 'rsk-4', credit_score: 780, risk_level: 'low', model_confidence: 96.1, assessed_at: new Date().toISOString() },
    ];
}
