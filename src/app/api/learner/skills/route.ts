import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const items: Array<{
      skillName: string;
      category?: string;
      proficiency?: string;
      provenance?: string;
      evidenceNote?: string;
    }> = Array.isArray(body.skills) ? body.skills : [body];

    const db = getDb();
    const now = new Date().toISOString();
    const inserted: Array<Record<string, unknown>> = [];

    const existingRows = db
      .prepare('SELECT skill_name FROM learner_skills WHERE user_id = ?')
      .all(user.id) as Array<{ skill_name: string }>;
    const existingSet = new Set(existingRows.map((r) => r.skill_name.toLowerCase()));

    const insertStmt = db.prepare(`
      INSERT INTO learner_skills (id, user_id, skill_name, category, proficiency, provenance, evidence_note, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of items) {
      const skillName = typeof item.skillName === 'string' ? item.skillName.trim() : '';
      if (!skillName || existingSet.has(skillName.toLowerCase())) continue;

      // Learners may only add 'self_declared' or 'ai_mapped'.
      // 'assessor_validated' and 'employer_verified' require authorized validation workflows.
      const provenance = item.provenance === 'ai_mapped' ? 'ai_mapped' : 'self_declared';
      const category = typeof item.category === 'string' ? item.category : 'hard_skill';
      const proficiency = typeof item.proficiency === 'string' ? item.proficiency : 'intermediate';
      const evidenceNote = typeof item.evidenceNote === 'string' ? item.evidenceNote.trim() : '';
      const id = `lsk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

      insertStmt.run(id, user.id, skillName, category, proficiency, provenance, evidenceNote, now);
      existingSet.add(skillName.toLowerCase());
      inserted.push({ id, skill_name: skillName, category, proficiency, provenance, evidence_note: evidenceNote, created_at: now });
    }

    return NextResponse.json({ added: inserted }, { status: 201 });
  } catch (error) {
    console.error('Error adding learner skills:', error);
    return NextResponse.json({ error: 'Failed to add skills.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const skillId = searchParams.get('id');
    if (!skillId) {
      return NextResponse.json({ error: 'Skill id is required.' }, { status: 400 });
    }

    const db = getDb();
    const res = db
      .prepare('DELETE FROM learner_skills WHERE id = ? AND user_id = ?')
      .run(skillId, user.id);

    if (res.changes === 0) {
      return NextResponse.json({ error: 'Skill not found.' }, { status: 404 });
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Error deleting learner skill:', error);
    return NextResponse.json({ error: 'Failed to delete skill.' }, { status: 500 });
  }
}
