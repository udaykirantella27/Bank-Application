import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// GET /api/admin/applications — List applications with optional status filter
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');

    try {
        let query = supabase
            .from('loan_applications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ applications: [] });
        }

        const applications = (data || []).map((app: Record<string, unknown>) => {
            return {
                id: app.id,
                user_id: app.user_id,
                // In a real banking app with Supabase Auth, we'd fetch profile data.
                // For now, mapping directly to prevent the PGRST200 join crash.
                name: 'Registered Customer',
                email: 'Secure User',
                loan_amount: app.loan_amount,
                loan_purpose: app.loan_purpose,
                employment_type: app.employment_type,
                monthly_salary: app.monthly_salary,
                term_months: app.term_months || 24, // Fallback since it doesn't exist in DB schema
                status: app.status,
                created_at: app.created_at,
            };
        });

        return NextResponse.json({ applications });
    } catch {
        return NextResponse.json({ applications: [] });
    }
}

// PATCH /api/admin/applications — Approve or reject
export async function PATCH(req: Request) {
    try {
        const { applicationId, status } = await req.json();

        if (!applicationId || !status) {
            return NextResponse.json({ error: 'applicationId and status are required' }, { status: 400 });
        }

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Status must be approved or rejected' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('loan_applications')
            .update({ status })
            .eq('id', applicationId)
            .select()
            .single();

        if (error) {
            console.error('Update error:', error);
            return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
        }

        return NextResponse.json({ success: true, application: data });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
