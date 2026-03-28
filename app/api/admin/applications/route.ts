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
            console.error('Supabase query error (loan_applications):', error.message, error.details);
            return NextResponse.json({ applications: [], error: error.message });
        }

        const apps = data || [];

        // Fetch profiles for all user_ids to get real name/email
        const userIds = [...new Set(apps.map((a: any) => a.user_id).filter(Boolean))];
        let profileMap: Record<string, { name: string | null; email: string | null }> = {};

        if (userIds.length > 0) {
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, name, email')
                .in('id', userIds);
            (profiles || []).forEach((p: any) => {
                profileMap[p.id] = { name: p.name, email: p.email };
            });
        }

        const applications = apps.map((app: Record<string, any>) => {
            const profile = profileMap[app.user_id] || {};
            return {
                id: app.id,
                user_id: app.user_id,
                name: profile.name || profile.email?.split('@')[0] || 'Customer',
                email: profile.email || '',
                loan_amount: app.loan_amount,
                loan_purpose: app.loan_purpose,
                employment_type: app.employment_type,
                monthly_salary: app.monthly_salary,
                term_months: app.term_months || 24,
                status: app.status,
                created_at: app.created_at,
            };
        });

        return NextResponse.json({ applications });
    } catch (err: any) {
        console.error('Unhandled internal error in applications API:', err);
        return NextResponse.json({ applications: [], error: err.message || 'Internal Server Error' });
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
