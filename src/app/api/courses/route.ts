import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM courses ORDER BY health_score DESC').all() as Array<{
      id: string;
      institute_id: string;
      institute_name: string;
      name: string;
      description: string;
      sector: string;
      duration: string;
      health_score: number;
      health_level: string;
      breakdown_json: string;
      required_skills_json: string;
      enrolled_count: number;
      completed_count: number;
      placed_count: number;
    }>;

    const courses = rows.map((r) => ({
      id: r.id,
      instituteId: r.institute_id,
      instituteName: r.institute_name,
      name: r.name,
      description: r.description,
      sector: r.sector,
      duration: r.duration,
      healthScore: r.health_score,
      healthLevel: r.health_level,
      healthBreakdown: JSON.parse(r.breakdown_json || '{}'),
      requiredSkills: JSON.parse(r.required_skills_json || '[]'),
      enrolledCount: r.enrolled_count,
      completedCount: r.completed_count,
      placedCount: r.placed_count,
    }));

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error loading courses:', error);
    return NextResponse.json({ error: 'Failed to load courses.' }, { status: 500 });
  }
}
