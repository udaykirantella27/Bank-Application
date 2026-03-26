import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET() {
    try {
        // Get users with their loan application count
        const { data: users, error } = await supabase
            .from('users')
            .select('id, email, name, phone, role, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ users: [] });
        }

        // Get loan counts per user
        const { data: loanCounts } = await supabase
            .from('loan_applications')
            .select('user_id');

        const countMap: Record<string, number> = {};
        (loanCounts || []).forEach((l: { user_id: string }) => {
            countMap[l.user_id] = (countMap[l.user_id] || 0) + 1;
        });

        const enrichedUsers = (users || []).map(u => ({
            ...u,
            loan_count: countMap[u.id] || 0,
        }));

        return NextResponse.json({ users: enrichedUsers });
    } catch {
        return NextResponse.json({ users: [] });
    }
}
