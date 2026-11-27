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
    let profile = db
      .prepare('SELECT * FROM learner_profiles WHERE user_id = ?')
      .get(user.id) as Record<string, unknown> | undefined;

    if (!profile) {
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO learner_profiles (user_id, headline, location, updated_at)
        VALUES (?, ?, ?, ?)
      `).run(user.id, 'SkillSync Learner', '', now);
      profile = db.prepare('SELECT * FROM learner_profiles WHERE user_id = ?').get(user.id) as Record<string, unknown>;
    }

    const skills = db
      .prepare('SELECT * FROM learner_skills WHERE user_id = ? ORDER BY created_at DESC')
      .all(user.id);

    const projects = db
      .prepare('SELECT * FROM portfolio_projects WHERE user_id = ? ORDER BY created_at DESC')
      .all(user.id);

    const assessments = db
      .prepare('SELECT * FROM assessments WHERE learner_id = ? ORDER BY created_at DESC')
      .all(user.id);

    return NextResponse.json({
      user,
      profile,
      skills,
      projects,
      assessments,
    });
  } catch (error) {
    console.error('Error loading learner profile:', error);
    return NextResponse.json({ error: 'Failed to load learner profile.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const db = getDb();
    const now = new Date().toISOString();

    const existing = db.prepare('SELECT user_id FROM learner_profiles WHERE user_id = ?').get(user.id);
    if (!existing) {
      db.prepare('INSERT INTO learner_profiles (user_id, updated_at) VALUES (?, ?)').run(user.id, now);
    }

    db.prepare(`
      UPDATE learner_profiles SET
        headline = COALESCE(?, headline),
        bio = COALESCE(?, bio),
        location = COALESCE(?, location),
        district = COALESCE(?, district),
        state = COALESCE(?, state),
        education_level = COALESCE(?, education_level),
        experience_level = COALESCE(?, experience_level),
        target_role = COALESCE(?, target_role),
        interests = COALESCE(?, interests),
        strengths = COALESCE(?, strengths),
        societal_needs = COALESCE(?, societal_needs),
        career_goals = COALESCE(?, career_goals),
        portfolio_public = COALESCE(?, portfolio_public),
        consent_tracking = COALESCE(?, consent_tracking),
        resume_filename = COALESCE(?, resume_filename),
        resume_text = COALESCE(?, resume_text),
        updated_at = ?
      WHERE user_id = ?
    `).run(
      typeof body.headline === 'string' ? body.headline.trim() : null,
      typeof body.bio === 'string' ? body.bio.trim() : null,
      typeof body.location === 'string' ? body.location.trim() : null,
      typeof body.district === 'string' ? body.district.trim() : null,
      typeof body.state === 'string' ? body.state.trim() : null,
      typeof body.education_level === 'string' ? body.education_level.trim() : null,
      typeof body.experience_level === 'string' ? body.experience_level.trim() : null,
      typeof body.target_role === 'string' ? body.target_role.trim() : null,
      typeof body.interests === 'string' ? body.interests.trim() : null,
      typeof body.strengths === 'string' ? body.strengths.trim() : null,
      typeof body.societal_needs === 'string' ? body.societal_needs.trim() : null,
      typeof body.career_goals === 'string' ? body.career_goals.trim() : null,
      typeof body.portfolio_public === 'boolean' ? (body.portfolio_public ? 1 : 0) : null,
      typeof body.consent_tracking === 'boolean' ? (body.consent_tracking ? 1 : 0) : null,
      typeof body.resume_filename === 'string' ? body.resume_filename.trim() : null,
      typeof body.resume_text === 'string' ? body.resume_text.slice(0, 15000) : null,
      now,
      user.id
    );

    const updated = db.prepare('SELECT * FROM learner_profiles WHERE user_id = ?').get(user.id);
    return NextResponse.json({ profile: updated });
  } catch (error) {
    console.error('Error updating learner profile:', error);
    return NextResponse.json({ error: 'Failed to update learner profile.' }, { status: 500 });
  }
}
