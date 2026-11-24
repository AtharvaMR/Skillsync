import { NextRequest, NextResponse } from 'next/server';
import { trainers } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  return NextResponse.json(trainers);
}
