import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const rows = db
      .prepare('SELECT * FROM employer_feedback ORDER BY created_at DESC')
      .all();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error loading employer feedback:', error);
    return NextResponse.json({ error: 'Failed to load feedback.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!['employer', 'institute', 'trainer', 'government', 'analyst'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden: Only employers or staff can submit industry feedback.' }, { status: 403 });
    }

    const body = await req.json();
    const skillName = typeof body.skillName === 'string' ? body.skillName.trim() : '';
    const feedbackType = typeof body.feedbackType === 'string' ? body.feedbackType : 'skill_gap';
    const rating = Math.max(1, Math.min(5, Number(body.rating || 4)));
    const comments = typeof body.comments === 'string' ? body.comments.trim() : '';

    if (!comments) {
      return NextResponse.json({ error: 'Feedback comments are required.' }, { status: 400 });
    }

    const db = getDb();
    const id = `fb_${Date.now().toString(36)}`;
    const now = new Date().toISOString();
    const employerName = user.organisationName || user.name;

    db.prepare(`
      INSERT INTO employer_feedback (id, employer_id, employer_name, course_id, skill_name, feedback_type, rating, comments, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, user.id, employerName, body.courseId || null, skillName || null, feedbackType, rating, comments, now);

    const created = db.prepare('SELECT * FROM employer_feedback WHERE id = ?').get(id);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error saving employer feedback:', error);
    return NextResponse.json({ error: 'Failed to save feedback.' }, { status: 500 });
  }
}
