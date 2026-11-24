import { NextRequest, NextResponse } from 'next/server';
import { employerFeedback } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  return NextResponse.json(employerFeedback);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  
  const newFeedback = {
    id: `fb-${Date.now()}`,
    ...data,
    submittedAt: new Date().toISOString()
  };
  
  // In a real app, this would be saved to a database
  // employerFeedback.push(newFeedback);

  return NextResponse.json(newFeedback, { status: 201 });
}
