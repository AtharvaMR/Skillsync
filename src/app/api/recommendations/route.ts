import { NextRequest, NextResponse } from 'next/server';
import { recommendations } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  return NextResponse.json(recommendations);
}
