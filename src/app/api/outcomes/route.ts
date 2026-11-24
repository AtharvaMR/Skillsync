import { NextRequest, NextResponse } from 'next/server';
import { employmentOutcomes } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  return NextResponse.json(employmentOutcomes);
}
