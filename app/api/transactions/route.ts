import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// GET /api/transactions — Fetch transactions
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    try {
        let query = supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (userId) {
            query = query.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
        }
        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ data: getMockTransactions(), source: 'mock' });
        }

        return NextResponse.json({ data, source: 'database' });
    } catch {
        return NextResponse.json({ data: getMockTransactions(), source: 'mock' });
    }
}

// POST /api/transactions — Initiate a new payment
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { senderId, receiverId, amount, paymentMethod, description } = body;

        if (!senderId || !amount || !paymentMethod) {
            return NextResponse.json({ error: 'senderId, amount, and paymentMethod are required' }, { status: 400 });
        }

        const settleTimeMs: Record<string, number> = {
            'upi_3.0': 340,
            'imps': 1500,
            'rtgs': 4200,
            'neft': 7200000,
            'auto_pay': 600,
        };

        const txn = {
            sender_id: senderId,
            receiver_id: receiverId || null,
            amount: parseFloat(amount),
            currency: 'INR',
            payment_method: paymentMethod,
            status: 'settled',
            settlement_time_ms: settleTimeMs[paymentMethod] || 1000,
            reference_id: `TXN-${Date.now()}`,
            description: description || 'Payment initiated via QIB',
            settled_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('transactions')
            .insert(txn)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ data: txn, source: 'simulated' });
        }

        return NextResponse.json({ data, source: 'database' });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

function getMockTransactions() {
    return [
        { id: 't1', amount: 245000, payment_method: 'upi_3.0', status: 'settled', settlement_time_ms: 340, created_at: new Date().toISOString() },
        { id: 't2', amount: 1850000, payment_method: 'rtgs', status: 'settled', settlement_time_ms: 800, created_at: new Date().toISOString() },
        { id: 't3', amount: 4999, payment_method: 'imps', status: 'processing', settlement_time_ms: null, created_at: new Date().toISOString() },
        { id: 't4', amount: 12500000, payment_method: 'neft', status: 'settled', settlement_time_ms: 1200, created_at: new Date().toISOString() },
    ];
}
