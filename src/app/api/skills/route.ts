import { NextRequest, NextResponse } from 'next/server';
import { skills } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const category = searchParams.get('category');
  const demandLevel = searchParams.get('demandLevel');
  const search = searchParams.get('search');

  let filteredSkills = skills;

  if (category) {
    filteredSkills = filteredSkills.filter(s => s.category === category);
  }
  if (demandLevel) {
    filteredSkills = filteredSkills.filter(s => s.demandLevel === demandLevel);
  }
  if (search) {
    const lowerSearch = search.toLowerCase();
    filteredSkills = filteredSkills.filter(s => 
      s.name.toLowerCase().includes(lowerSearch) || 
      s.description.toLowerCase().includes(lowerSearch)
    );
  }

  return NextResponse.json(filteredSkills);
}
