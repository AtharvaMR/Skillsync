import { NextRequest, NextResponse } from 'next/server';
import { courses } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  return NextResponse.json(courses);
}
