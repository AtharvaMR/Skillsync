import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const demandLevel = searchParams.get('demandLevel');
    const search = searchParams.get('search');

    const db = getDb();
    let rows = db.prepare('SELECT * FROM skills_catalog ORDER BY demand_score DESC').all() as Array<{
      id: string;
      name: string;
      category: string;
      description: string;
      demand_score: number;
      growth_rate: number;
      demand_level: string;
      sector: string;
    }>;

    if (category) {
      rows = rows.filter((s) => s.category === category);
    }
    if (demandLevel) {
      rows = rows.filter((s) => s.demand_level === demandLevel);
    }
    if (search) {
      const lower = search.toLowerCase();
      rows = rows.filter(
        (s) => s.name.toLowerCase().includes(lower) || s.description.toLowerCase().includes(lower)
      );
    }

    const mapped = rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      description: r.description,
      demandScore: r.demand_score,
      growthRate: r.growth_rate,
      demandLevel: r.demand_level,
      sector: r.sector,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error loading skills catalog:', error);
    return NextResponse.json({ error: 'Failed to load skills.' }, { status: 500 });
  }
}
