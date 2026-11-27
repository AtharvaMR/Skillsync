import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';

const ASSESSOR_ROLES = new Set(['trainer', 'institute', 'government', 'employer']);

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!ASSESSOR_ROLES.has(user.role)) {
      return NextResponse.json({ error: 'Forbidden: Assessor access required.' }, { status: 403 });
    }

    const db = getDb();
    const submissions = db
      .prepare(`
        SELECT
          p.*,
          u.name as learner_name,
          lp.location as learner_location,
          lp.target_role as learner_target_role
        FROM portfolio_projects p
        JOIN users u ON u.id = p.user_id
        LEFT JOIN learner_profiles lp ON lp.user_id = p.user_id
        ORDER BY CASE WHEN p.status = 'submitted' THEN 0 ELSE 1 END, p.created_at DESC
      `)
      .all();

    const assessments = db
      .prepare('SELECT * FROM assessments ORDER BY created_at DESC')
      .all();

    return NextResponse.json({ submissions, assessments });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json({ error: 'Failed to load assessment queue.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!ASSESSOR_ROLES.has(user.role)) {
      return NextResponse.json({ error: 'Forbidden: Only trainers, institutes, or employers can validate competencies.' }, { status: 403 });
    }

    const body = await req.json();
    const projectId = typeof body.projectId === 'string' ? body.projectId : '';
    const decision = body.decision === 'approved' || body.decision === 'needs_revision' || body.decision === 'rejected'
      ? body.decision
      : 'approved';
    const rubricScore = Math.max(0, Math.min(100, Number(body.rubricScore || 80)));
    const feedback = typeof body.feedback === 'string' ? body.feedback.trim() : '';
    const validatedSkills: string[] = Array.isArray(body.validatedSkills)
      ? body.validatedSkills.filter((s: unknown) => typeof s === 'string').map((s: string) => s.trim()).filter(Boolean)
      : [];

    if (!projectId || !feedback) {
      return NextResponse.json({ error: 'projectId and structured feedback are required.' }, { status: 400 });
    }

    const db = getDb();
    const project = db
      .prepare('SELECT id, user_id, title FROM portfolio_projects WHERE id = ?')
      .get(projectId) as { id: string; user_id: string; title: string } | undefined;

    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const assessmentId = `asm_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const newStatus = decision === 'approved' ? 'validated' : 'needs_revision';
    const targetProvenance = user.role === 'employer' ? 'employer_verified' : 'assessor_validated';
    const validatorLabel = `${user.name} (${user.role === 'employer' ? user.organisationName || 'Employer' : 'Assessor'})`;

    const txn = db.transaction(() => {
      db.prepare(`
        INSERT INTO assessments (
          id, project_id, learner_id, assessor_id, assessor_name, assessor_role,
          decision, validated_skills_json, rubric_score, feedback, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        assessmentId,
        project.id,
        project.user_id,
        user.id,
        user.name,
        user.role,
        decision,
        JSON.stringify(validatedSkills),
        rubricScore,
        feedback,
        now
      );

      db.prepare('UPDATE portfolio_projects SET status = ? WHERE id = ?').run(newStatus, project.id);

      if (decision === 'approved' && validatedSkills.length > 0) {
        const existingSkills = db
          .prepare('SELECT id, skill_name, provenance FROM learner_skills WHERE user_id = ?')
          .all(project.user_id) as Array<{ id: string; skill_name: string; provenance: string }>;

        for (const skillName of validatedSkills) {
          const match = existingSkills.find(
            (es) => es.skill_name.toLowerCase() === skillName.toLowerCase()
          );
          if (match) {
            // Do not downgrade employer_verified to assessor_validated
            const nextProv =
              match.provenance === 'employer_verified' ? 'employer_verified' : targetProvenance;
            db.prepare(`
              UPDATE learner_skills
              SET provenance = ?, evidence_note = ?, validated_by = ?, validated_at = ?
              WHERE id = ?
            `).run(nextProv, `Validated via project: ${project.title}`, validatorLabel, now, match.id);
          } else {
            const skId = `lsk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
            db.prepare(`
              INSERT INTO learner_skills (id, user_id, skill_name, category, proficiency, provenance, evidence_note, validated_by, validated_at, created_at)
              VALUES (?, ?, ?, 'hard_skill', 'intermediate', ?, ?, ?, ?, ?)
            `).run(skId, project.user_id, skillName, targetProvenance, `Validated via project: ${project.title}`, validatorLabel, now, now);
          }
        }
      }
    });

    txn();

    return NextResponse.json({ assessmentId, status: newStatus }, { status: 201 });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    return NextResponse.json({ error: 'Failed to submit assessment.' }, { status: 500 });
  }
}
