import { NextRequest, NextResponse } from 'next/server';
import { jobs } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const sector = searchParams.get('sector');
  const location = searchParams.get('location');

  let filteredJobs = jobs;

  if (sector) {
    filteredJobs = filteredJobs.filter(j => j.sector === sector);
  }
  if (location) {
    filteredJobs = filteredJobs.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
  }

  return NextResponse.json(filteredJobs);
}
