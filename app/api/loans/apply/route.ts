import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Loan application submitted successfully (Mock Endpoint)' });
}
