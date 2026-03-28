import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// GET /api/customer/loans — Fetch loans for the logged-in customer
// Since we use localStorage auth (mock), we accept email in query
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    try {
        if (email) {
            // Get user by email first
            const { data: user } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', email)
                .single();

            if (user) {
                const { data: loans } = await supabase
                    .from('loan_applications')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                return NextResponse.json({ loans: loans || [] });
            }
        }

        // If no email or user not found, return all for demo
        const { data: loans } = await supabase
            .from('loan_applications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        return NextResponse.json({ loans: loans || [] });
    } catch {
        return NextResponse.json({ loans: [] });
    }
}
