import { NextRequest, NextResponse } from 'next/server';
import { analyticsData } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  return NextResponse.json(analyticsData);
}
