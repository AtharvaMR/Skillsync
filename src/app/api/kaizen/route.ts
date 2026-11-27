import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const cycles = db
      .prepare('SELECT * FROM kaizen_cycles ORDER BY created_at DESC')
      .all();
    return NextResponse.json({ cycles });
  } catch (error) {
    console.error('Error loading kaizen cycles:', error);
    return NextResponse.json({ error: 'Failed to load Kaizen cycles.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!['trainer', 'institute', 'government', 'analyst'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const phase = ['plan', 'do', 'check', 'act'].includes(body.phase) ? body.phase : 'plan';
    const category = typeof body.category === 'string' ? body.category.trim() : 'Curriculum';
    const evidence = typeof body.evidence === 'string' ? body.evidence.trim() : '';
    const impactMetric = typeof body.impactMetric === 'string' ? body.impactMetric.trim() : '';

    if (!title || !evidence) {
      return NextResponse.json({ error: 'Title and evidence are required.' }, { status: 400 });
    }

    const db = getDb();
    const id = `kz_${Date.now().toString(36)}`;
    const now = new Date().toISOString();
    const statusMap: Record<string, string> = {
      plan: 'Planned',
      do: 'Active',
      check: 'Measuring',
      act: 'Completed',
    };

    db.prepare(`
      INSERT INTO kaizen_cycles (id, title, phase, category, status, evidence, impact_metric, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, phase, category, statusMap[phase], evidence, impactMetric || 'Tracking cohort outcomes', now);

    const created = db.prepare('SELECT * FROM kaizen_cycles WHERE id = ?').get(id);
    return NextResponse.json({ cycle: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating kaizen cycle:', error);
    return NextResponse.json({ error: 'Failed to create Kaizen cycle.' }, { status: 500 });
  }
}
