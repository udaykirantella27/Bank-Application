import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET() {
    try {
        const [usersRes, appsRes] = await Promise.all([
            supabase.from('users').select('id', { count: 'exact' }),
            supabase.from('loan_applications').select('id, status, loan_amount'),
        ]);

        const apps = appsRes.data || [];
        const totalDisbursed = apps.filter(a => a.status === 'approved').reduce((sum, a) => sum + Number(a.loan_amount || 0), 0);

        // Count campaigns from DB if table exists
        let campaignCount = 0;
        try {
            const campaignsRes = await supabase.from('campaigns').select('id', { count: 'exact' });
            if (campaignsRes.count) campaignCount = campaignsRes.count;
        } catch { /* table may not exist */ }

        // Try reading file-based campaigns
        try {
            const fs = await import('fs');
            const path = await import('path');
            const historyPath = process.env.VERCEL ? '/tmp/history.json' : path.join(process.cwd(), 'data', 'history.json');
            if (fs.existsSync(historyPath)) {
                const data = JSON.parse(fs.readFileSync(historyPath, 'utf8') || '[]');
                campaignCount = Math.max(campaignCount, data.length);
            }
        } catch { /* ignore */ }

        return NextResponse.json({
            totalUsers: usersRes.count || 0,
            totalApplications: apps.length,
            pendingApplications: apps.filter(a => a.status === 'pending').length,
            approvedApplications: apps.filter(a => a.status === 'approved').length,
            rejectedApplications: apps.filter(a => a.status === 'rejected').length,
            totalDisbursed,
            campaignsSent: campaignCount,
        });
    } catch {
        return NextResponse.json({
            totalUsers: 0, totalApplications: 0, pendingApplications: 0,
            approvedApplications: 0, rejectedApplications: 0, totalDisbursed: 0, campaignsSent: 0,
        });
    }
}
