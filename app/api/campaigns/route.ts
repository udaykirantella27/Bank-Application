import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const historyPath = path.join(process.cwd(), 'data', 'history.json');
  if (fs.existsSync(historyPath)) {
    const data = fs.readFileSync(historyPath, 'utf8');
    return NextResponse.json(JSON.parse(data || '[]'));
  }
  return NextResponse.json([]);
}
