import { NextRequest, NextResponse } from 'next/server';
import { districts } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  return NextResponse.json(districts);
}
