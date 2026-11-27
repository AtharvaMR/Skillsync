import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || '').trim().toLowerCase();

    const db = getDb();
    const learners = db
      .prepare(`
        SELECT
          u.id,
          u.name,
          lp.headline,
          lp.location,
          lp.target_role,
          lp.portfolio_public
        FROM users u
        LEFT JOIN learner_profiles lp ON lp.user_id = u.id
        WHERE u.role = 'student'
        ORDER BY u.created_at DESC
      `)
      .all() as Array<{
        id: string;
        name: string;
        headline: string | null;
        location: string | null;
        target_role: string | null;
        portfolio_public: number | null;
      }>;

    const allSkills = db
      .prepare('SELECT user_id, skill_name, provenance FROM learner_skills')
      .all() as Array<{ user_id: string; skill_name: string; provenance: string }>;

    const allProjects = db
      .prepare('SELECT user_id, status FROM portfolio_projects')
      .all() as Array<{ user_id: string; status: string }>;

    const isPrivileged = ['government', 'institute', 'trainer'].includes(user.role);

    const results = learners
      .map((l) => {
        const skills = allSkills.filter((s) => s.user_id === l.id);
        const projects = allProjects.filter((p) => p.user_id === l.id);
        const verifiedCount = skills.filter(
          (s) => s.provenance === 'assessor_validated' || s.provenance === 'employer_verified'
        ).length;
        const validatedProjects = projects.filter((p) => p.status === 'validated').length;
        const isPublic = l.portfolio_public !== 0;
        const canViewIdentity = isPrivileged || (user.role === 'employer' && isPublic);

        return {
          id: l.id,
          displayId: canViewIdentity ? l.id : `${l.id.slice(0, 7)}***`,
          name: canViewIdentity ? l.name : `Verified Learner (${l.id.slice(-4)})`,
          headline: l.headline || 'SkillSync Learner',
          location: l.location || 'India',
          targetRole: l.target_role || 'Entry-level Role',
          portfolioPublic: isPublic,
          skills,
          verifiedCount,
          validatedProjects,
          totalProjects: projects.length,
        };
      })
      .filter((c) => {
        if (!search) return true;
        const hay = `${c.name} ${c.location} ${c.targetRole} ${c.skills.map((s) => s.skill_name).join(' ')}`.toLowerCase();
        return hay.includes(search);
      });

    return NextResponse.json({ candidates: results });
  } catch (error) {
    console.error('Error loading candidates:', error);
    return NextResponse.json({ error: 'Failed to load candidates.' }, { status: 500 });
  }
}
