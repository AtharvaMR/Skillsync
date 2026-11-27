import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const projects = db
      .prepare('SELECT * FROM portfolio_projects WHERE user_id = ? ORDER BY created_at DESC')
      .all(user.id);
    const assessments = db
      .prepare('SELECT * FROM assessments WHERE learner_id = ? ORDER BY created_at DESC')
      .all(user.id);
    const skills = db
      .prepare('SELECT * FROM learner_skills WHERE user_id = ? ORDER BY created_at DESC')
      .all(user.id);
    const profile = db
      .prepare('SELECT portfolio_public FROM learner_profiles WHERE user_id = ?')
      .get(user.id) as { portfolio_public: number } | undefined;

    return NextResponse.json({
      projects,
      assessments,
      skills,
      portfolioPublic: profile ? Boolean(profile.portfolio_public) : true,
    });
  } catch (error) {
    console.error('Error loading portfolio:', error);
    return NextResponse.json({ error: 'Failed to load portfolio.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const roleInProject = typeof body.roleInProject === 'string' ? body.roleInProject.trim() : '';
    const demoUrl = typeof body.demoUrl === 'string' ? body.demoUrl.trim() : '';
    const skills: string[] = Array.isArray(body.skills)
      ? body.skills.filter((s: unknown) => typeof s === 'string').map((s: string) => s.trim()).filter(Boolean)
      : [];
    const attachmentPath = typeof body.attachmentPath === 'string' ? body.attachmentPath : null;
    const attachmentName = typeof body.attachmentName === 'string' ? body.attachmentName : null;
    const attachmentMime = typeof body.attachmentMime === 'string' ? body.attachmentMime : null;

    if (!title || !description) {
      return NextResponse.json({ error: 'Project title and description are required.' }, { status: 400 });
    }

    const db = getDb();
    const id = `prj_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();

    const txn = db.transaction(() => {
      db.prepare(`
        INSERT INTO portfolio_projects (
          id, user_id, title, description, role_in_project, skills_json, demo_url,
          attachment_path, attachment_name, attachment_mime, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted', ?)
      `).run(
        id,
        user.id,
        title,
        description,
        roleInProject,
        JSON.stringify(skills),
        demoUrl,
        attachmentPath,
        attachmentName,
        attachmentMime,
        now
      );

      // Ensure mapped skills exist as self_declared if not already present
      const existing = db
        .prepare('SELECT skill_name FROM learner_skills WHERE user_id = ?')
        .all(user.id) as Array<{ skill_name: string }>;
      const existingLower = new Set(existing.map((e) => e.skill_name.toLowerCase()));

      const insertSkill = db.prepare(`
        INSERT INTO learner_skills (id, user_id, skill_name, category, proficiency, provenance, evidence_note, created_at)
        VALUES (?, ?, ?, 'hard_skill', 'intermediate', 'self_declared', ?, ?)
      `);

      for (const sk of skills) {
        if (!existingLower.has(sk.toLowerCase())) {
          const skId = `lsk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
          insertSkill.run(skId, user.id, sk, `Demonstrated in project: ${title}`, now);
          existingLower.add(sk.toLowerCase());
        }
      }
    });

    txn();

    const created = db.prepare('SELECT * FROM portfolio_projects WHERE id = ?').get(id);
    return NextResponse.json({ project: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio project:', error);
    return NextResponse.json({ error: 'Failed to save portfolio project.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('id');
    if (!projectId) {
      return NextResponse.json({ error: 'Project id is required.' }, { status: 400 });
    }

    const db = getDb();
    const res = db
      .prepare('DELETE FROM portfolio_projects WHERE id = ? AND user_id = ?')
      .run(projectId, user.id);

    if (res.changes === 0) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project.' }, { status: 500 });
  }
}
