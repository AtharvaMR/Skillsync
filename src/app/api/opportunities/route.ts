import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { computeCohereSemanticMatches } from '@/lib/ai/cohere-matcher';

interface OpportunityRow {
  id: string;
  title: string;
  employer_id: string;
  employer_name: string;
  type: string;
  sector: string;
  location: string;
  district: string;
  state: string;
  is_remote: number;
  stipend_or_salary: string;
  experience_required: string;
  eligibility: string;
  required_skills_json: string;
  description: string;
  posted_at: string;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const typeFilter = searchParams.get('type') || 'all';
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const remoteOnly = searchParams.get('remote') === 'true';

    const db = getDb();
    const rows = db
      .prepare('SELECT * FROM opportunities ORDER BY posted_at DESC')
      .all() as OpportunityRow[];

    const learnerSkills = db
      .prepare('SELECT skill_name, provenance FROM learner_skills WHERE user_id = ?')
      .all(user.id) as Array<{ skill_name: string; provenance: string }>;

    const profile = db
      .prepare('SELECT headline, target_role, location, district, state, experience_level FROM learner_profiles WHERE user_id = ?')
      .get(user.id) as {
        headline?: string;
        target_role?: string;
        location?: string;
        district?: string;
        state?: string;
        experience_level?: string;
      } | undefined;

    const appliedRows = db
      .prepare('SELECT opportunity_id, status FROM opportunity_applications WHERE user_id = ?')
      .all(user.id) as Array<{ opportunity_id: string; status: string }>;
    const appliedMap = new Map(appliedRows.map((a) => [a.opportunity_id, a.status]));

    const skillProvMap = new Map<string, string>();
    for (const s of learnerSkills) {
      skillProvMap.set(s.skill_name.toLowerCase(), s.provenance);
    }

    const filteredRows = rows.filter((opp) => {
      if (typeFilter !== 'all' && opp.type !== typeFilter) return false;
      if (remoteOnly && !opp.is_remote) return false;
      if (search) {
        const hay = `${opp.title} ${opp.employer_name} ${opp.sector} ${opp.location} ${opp.required_skills_json}`.toLowerCase();
        if (!hay.includes(search)) return false;
      }
      return true;
    });

    const learnerSummaryText = [
      profile?.headline || '',
      profile?.target_role ? `Target role: ${profile.target_role}` : '',
      `Skills: ${learnerSkills.map((s) => s.skill_name).join(', ')}`,
    ]
      .filter(Boolean)
      .join('. ');

    const { scores: semanticScores, engine: matchingEngine } = await computeCohereSemanticMatches(
      learnerSummaryText,
      filteredRows.map((opp) => ({
        id: opp.id,
        text: `${opp.title}. Sector: ${opp.sector}. Required skills: ${JSON.parse(opp.required_skills_json || '[]').join(', ')}. ${opp.description}`,
      }))
    );

    const enriched = filteredRows
      .map((opp) => {
        const requiredSkills = JSON.parse(opp.required_skills_json || '[]') as string[];
        const matchedSkills: Array<{ name: string; provenance: string }> = [];
        const missingSkills: string[] = [];

        for (const reqSkill of requiredSkills) {
          const prov = skillProvMap.get(reqSkill.toLowerCase());
          if (prov) {
            matchedSkills.push({ name: reqSkill, provenance: prov });
          } else {
            missingSkills.push(reqSkill);
          }
        }

        let earnedPoints = 0;
        for (const ms of matchedSkills) {
          if (ms.provenance === 'employer_verified' || ms.provenance === 'assessor_validated') {
            earnedPoints += 1;
          } else {
            earnedPoints += 0.75;
          }
        }
        const skillRatio = requiredSkills.length > 0 ? earnedPoints / requiredSkills.length : 0.5;
        const semanticScore = semanticScores[opp.id] ?? 0;

        const learnerLoc = `${profile?.location || ''} ${profile?.district || ''} ${profile?.state || ''}`.toLowerCase();
        const sameRegion =
          Boolean(profile?.state && opp.state.toLowerCase() === profile.state.toLowerCase()) ||
          Boolean(profile?.district && opp.district.toLowerCase() === profile.district.toLowerCase()) ||
          Boolean(profile?.location && learnerLoc.includes(opp.district.toLowerCase()));

        const locationBonus = opp.is_remote || sameRegion ? 15 : 0;
        const matchScore = Math.min(
          100,
          Math.round(skillRatio * 55 + (semanticScore / 100) * 30 + locationBonus)
        );

        const matchReasons: string[] = [];
        if (matchedSkills.length > 0) {
          const validatedNames = matchedSkills
            .filter((m) => m.provenance === 'assessor_validated' || m.provenance === 'employer_verified')
            .map((m) => m.name);
          if (validatedNames.length > 0) {
            matchReasons.push(`Verified skills match: ${validatedNames.join(', ')}`);
          } else {
            matchReasons.push(`Declared/AI-mapped skills match: ${matchedSkills.map((m) => m.name).join(', ')}`);
          }
        } else {
          matchReasons.push(`Starter pathway opportunity in ${opp.sector}`);
        }

        matchReasons.push(
          `Semantic skill similarity (${matchingEngine === 'cohere' ? 'Cohere Embeddings' : 'Lexical'}): ${semanticScore}%`
        );

        if (opp.is_remote) {
          matchReasons.push('Remote-friendly: accessible from any district');
        } else if (sameRegion) {
          matchReasons.push(`Located in your region (${opp.location})`);
        }

        if (missingSkills.length > 0 && opp.type === 'training_program') {
          matchReasons.push(`Addresses missing skills: ${missingSkills.slice(0, 3).join(', ')}`);
        } else if (missingSkills.length > 0) {
          matchReasons.push(`To strengthen fit, build proof in: ${missingSkills.slice(0, 2).join(', ')}`);
        }

        return {
          ...opp,
          requiredSkills,
          matchedSkills,
          missingSkills,
          semanticScore,
          matchingEngine,
          matchScore,
          matchReasons,
          applicationStatus: appliedMap.get(opp.id) || null,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({ opportunities: enriched, matchingEngine });
  } catch (error) {
    console.error('Error loading opportunities:', error);
    return NextResponse.json({ error: 'Failed to load opportunities.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const db = getDb();
    const now = new Date().toISOString();

    if (body.action === 'apply') {
      const opportunityId = typeof body.opportunityId === 'string' ? body.opportunityId : '';
      const matchScore = Number(body.matchScore || 0);
      if (!opportunityId) {
        return NextResponse.json({ error: 'opportunityId is required.' }, { status: 400 });
      }
      const oppExists = db.prepare('SELECT id FROM opportunities WHERE id = ?').get(opportunityId);
      if (!oppExists) {
        return NextResponse.json({ error: 'Opportunity not found.' }, { status: 404 });
      }
      const appId = `app_${Date.now().toString(36)}`;
      db.prepare(`
        INSERT OR IGNORE INTO opportunity_applications (id, opportunity_id, user_id, status, match_score, created_at)
        VALUES (?, ?, ?, 'applied', ?, ?)
      `).run(appId, opportunityId, user.id, matchScore, now);
      return NextResponse.json({ applied: true }, { status: 201 });
    }

    if (!['employer', 'institute', 'government'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden: Only employers or institutes can post opportunities.' }, { status: 403 });
    }

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const type = typeof body.type === 'string' ? body.type : 'internship';
    const sector = typeof body.sector === 'string' ? body.sector.trim() : 'Information Technology';
    const location = typeof body.location === 'string' ? body.location.trim() : 'Bengaluru, Karnataka';
    const stipendOrSalary = typeof body.stipendOrSalary === 'string' ? body.stipendOrSalary.trim() : 'Competitive';
    const eligibility = typeof body.eligibility === 'string' ? body.eligibility.trim() : 'Open to verified learners';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const requiredSkills = Array.isArray(body.requiredSkills) ? body.requiredSkills : [];
    const isRemote = body.isRemote ? 1 : 0;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required.' }, { status: 400 });
    }

    const id = `opp_${Date.now().toString(36)}`;
    db.prepare(`
      INSERT INTO opportunities (
        id, title, employer_id, employer_name, type, sector, location, district, state,
        is_remote, stipend_or_salary, experience_required, eligibility, required_skills_json, description, posted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title,
      user.id,
      user.organisationName || user.name,
      type,
      sector,
      location,
      location.split(',')[0]?.trim() || location,
      location.split(',')[1]?.trim() || 'India',
      isRemote,
      stipendOrSalary,
      'Fresher / Entry-level',
      eligibility,
      JSON.stringify(requiredSkills),
      description,
      now
    );

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error('Error in opportunities POST:', error);
    return NextResponse.json({ error: 'Failed to process opportunity request.' }, { status: 500 });
  }
}
