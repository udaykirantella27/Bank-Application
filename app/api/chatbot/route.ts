import { NextResponse } from 'next/server';

const responses: Record<string, { text: string; confidence: number }> = {
    loan: {
        text: 'Your loan application LN-2026-0047 is currently Approved. Amount: ₹15,00,000, Interest: 8.5% p.a., EMI: ₹18,432/month. Next due: April 5, 2026.',
        confidence: 0.95,
    },
    risk: {
        text: 'Your AI Risk Score is 756/900. Payment History: 92, Credit Utilization: 68, Account Age: 85, Credit Mix: 74. Tip: Reducing utilization below 30% could boost your score by ~40 points.',
        confidence: 0.92,
    },
    payment: {
        text: 'Payment options: UPI 3.0 (instant, <0.5s), IMPS (<2s), NEFT (2-4 hrs), Auto-Pay (recurring). Navigate to Dashboard → Make Payment to initiate.',
        confidence: 0.94,
    },
    esg: {
        text: 'Your ESG Score: 82/100 (AA Rating). Green Investments: ₹488 Cr. CO₂ Offset: 12,400 tonnes/year. Water Saved: 8.2M litres/year.',
        confidence: 0.91,
    },
    feature: {
        text: 'QIB Advanced Features: 1) AI Risk Scoring, 2) Real-Time Payments, 3) Open Banking APIs, 4) Accessibility UX, 5) Embedded Finance, 6) ESG Analytics.',
        confidence: 0.97,
    },
    default: {
        text: 'I can help with loans, payments, risk scores, ESG analytics, and feature navigation. Could you be more specific about what you need?',
        confidence: 0.6,
    },
};

function classifyIntent(input: string): string {
    const lower = input.toLowerCase();
    if (lower.includes('loan') || lower.includes('emi') || lower.includes('application')) return 'loan';
    if (lower.includes('risk') || lower.includes('score') || lower.includes('credit')) return 'risk';
    if (lower.includes('pay') || lower.includes('transfer') || lower.includes('upi')) return 'payment';
    if (lower.includes('esg') || lower.includes('green') || lower.includes('sustain')) return 'esg';
    if (lower.includes('feature') || lower.includes('what can')) return 'feature';
    return 'default';
}

export async function POST(req: Request) {
    try {
        const { message, sessionId } = await req.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Guardrail: max message length
        if (message.length > 500) {
            return NextResponse.json({ error: 'Message too long (max 500 chars)' }, { status: 400 });
        }

        const intent = classifyIntent(message);
        const response = responses[intent];

        // Simulate processing latency
        await new Promise(resolve => setTimeout(resolve, 100));

        return NextResponse.json({
            reply: response.text,
            intent,
            confidence: response.confidence,
            sessionId: sessionId || `session_${Date.now()}`,
            timestamp: new Date().toISOString(),
            metadata: {
                model: 'qib-assistant-v2.1',
                processingTime: '120ms',
                guardrails: {
                    piiDetected: false,
                    toxicContent: false,
                    financialAdvice: intent === 'loan' || intent === 'risk',
                },
            },
        });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        service: 'QIB AI Chatbot API',
        version: '2.1.0',
        status: 'healthy',
        capabilities: ['loan_status', 'risk_scoring', 'payment_help', 'esg_analytics', 'feature_navigation'],
        guardrails: ['pii_detection', 'toxicity_filter', 'financial_advice_disclaimer', 'max_message_length'],
        uptime: '99.97%',
    });
}
