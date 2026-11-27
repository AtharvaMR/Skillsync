import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { getDefaultProvider } from '@/lib/ai/provider';
import { extractSkillsFromText } from '@/lib/ai/skill-extractor';
import { getDb } from '@/lib/db';

const ROLE_SKILL_BENCHMARKS: Record<string, { skills: string[]; sector: string }> = {
  'Full Stack Web Developer': {
    sector: 'Information Technology',
    skills: ['JavaScript', 'React', 'HTML/CSS', 'TypeScript', 'Node.js', 'SQL', 'REST APIs', 'Git'],
  },
  'Data Analyst': {
    sector: 'Information Technology',
    skills: ['SQL', 'Python', 'Power BI', 'Data Analytics', 'Excel', 'Communication'],
  },
  'Cloud & DevOps Associate': {
    sector: 'Information Technology',
    skills: ['Cloud Computing', 'Linux', 'Docker', 'Git', 'Python', 'CI/CD', 'Cybersecurity'],
  },
  'EV Battery & Diagnostics Technician': {
    sector: 'Automotive',
    skills: ['EV Technology', 'Battery Technology', 'Electrical Wiring', 'PLC Programming'],
  },
  'Solar PV Technician': {
    sector: 'Energy',
    skills: ['Solar Energy', 'Electrical Wiring', 'HVAC'],
  },
};

interface AIExplanationResponse {
  summary: string;
  gapReasons: Array<{ skill: string; whyItMatters: string; priority: 'High' | 'Medium' | 'Low' }>;
  roadmap: Array<{ step: string; duration: string; focusSkills: string[]; outcome: string }>;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rate = checkRateLimit(`ai:${user.id}`, 25, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Rate limit reached. Please retry in ${rate.retryAfterSeconds}s.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const targetRole = typeof body.targetRole === 'string' && body.targetRole.trim()
      ? body.targetRole.trim()
      : 'Full Stack Web Developer';
    const resumeText = typeof body.resumeText === 'string' ? body.resumeText.trim() : '';
    const extraSkills: string[] = Array.isArray(body.skills)
      ? body.skills.filter((s: unknown) => typeof s === 'string').map((s: string) => s.trim()).filter(Boolean)
      : [];

    const db = getDb();
    const savedSkills = db
      .prepare('SELECT skill_name, provenance FROM learner_skills WHERE user_id = ?')
      .all(user.id) as Array<{ skill_name: string; provenance: string }>;

    let extractedFromResume: Array<{ name: string; category: string }> = [];
    if (resumeText.length >= 10) {
      const ext = await extractSkillsFromText(resumeText.slice(0, 10000));
      extractedFromResume = ext.map((s) => ({ name: s.name, category: s.category }));
    }

    const currentSkillSet = new Set<string>([
      ...savedSkills.map((s) => s.skill_name),
      ...extraSkills,
      ...extractedFromResume.map((s) => s.name),
    ]);

    const normalizedCurrent = Array.from(currentSkillSet);
    const lowerCurrent = new Set(normalizedCurrent.map((s) => s.toLowerCase()));

    const benchmark = ROLE_SKILL_BENCHMARKS[targetRole] || {
      sector: 'Information Technology',
      skills: ['JavaScript', 'SQL', 'Python', 'Git', 'Communication', 'Problem Solving'],
    };

    const matchedSkills = benchmark.skills.filter((reqSkill) => lowerCurrent.has(reqSkill.toLowerCase()));
    const missingSkills = benchmark.skills.filter((reqSkill) => !lowerCurrent.has(reqSkill.toLowerCase()));
    const coveragePercent = benchmark.skills.length
      ? Math.round((matchedSkills.length / benchmark.skills.length) * 100)
      : 0;

    let aiSummary = '';
    let gapReasons: AIExplanationResponse['gapReasons'] = [];
    let roadmap: AIExplanationResponse['roadmap'] = [];
    let aiPowered = false;

    try {
      const provider = getDefaultProvider();
      if (provider.name !== 'Mock AI (No API Key)') {
        const prompt = `
          Analyze a learner's skill gap for the role "${targetRole}" (${benchmark.sector}).
          Current skills: ${normalizedCurrent.join(', ') || 'None'}
          Matched benchmark skills: ${matchedSkills.join(', ') || 'None'}
          Missing benchmark skills: ${missingSkills.join(', ') || 'None'}

          Provide clear, practical, non-generic explanations tailored to employability and hands-on portfolio building.
          Return ONLY valid JSON with keys:
          {
            "summary": "2-sentence assessment of readiness and next priority",
            "gapReasons": [{ "skill": "string", "whyItMatters": "specific job task explanation", "priority": "High"|"Medium"|"Low" }],
            "roadmap": [{ "step": "string", "duration": "e.g. Weeks 1-3", "focusSkills": ["string"], "outcome": "concrete deliverable" }]
          }
        `;
        const aiResult = await provider.generateJSON<AIExplanationResponse>(prompt);
        if (aiResult && aiResult.summary) {
          aiSummary = aiResult.summary;
          gapReasons = Array.isArray(aiResult.gapReasons) ? aiResult.gapReasons : [];
          roadmap = Array.isArray(aiResult.roadmap) ? aiResult.roadmap : [];
          aiPowered = true;
        }
      }
    } catch (aiErr) {
      console.warn('Gap analysis AI fallback triggered:', aiErr);
    }

    if (!aiSummary) {
      aiSummary =
        missingSkills.length === 0
          ? `You cover all ${benchmark.skills.length} core benchmark skills for ${targetRole}. Focus on getting assessor validation on practical projects.`
          : `You currently cover ${matchedSkills.length} of ${benchmark.skills.length} core skills (${coveragePercent}%) for ${targetRole}. Closing ${missingSkills.slice(0, 3).join(', ')} through a practical project will significantly improve job readiness.`;
    }

    if (gapReasons.length === 0) {
      gapReasons = missingSkills.map((skill, idx) => ({
        skill,
        whyItMatters: `${skill} appears consistently in ${targetRole} job postings and employer competency checklists.`,
        priority: idx < 2 ? 'High' : 'Medium',
      }));
    }

    if (roadmap.length === 0) {
      roadmap = [
        {
          step: 'Close Core Missing Competencies',
          duration: 'Weeks 1–4',
          focusSkills: missingSkills.slice(0, 2).length ? missingSkills.slice(0, 2) : benchmark.skills.slice(0, 2),
          outcome: 'Complete guided exercises and document notes',
        },
        {
          step: 'Build Evidence-Backed Practical Project',
          duration: 'Weeks 5–8',
          focusSkills: missingSkills.slice(2, 4).length ? missingSkills.slice(2, 4) : matchedSkills.slice(0, 2),
          outcome: 'Upload project work sample to Skill Portfolio for trainer validation',
        },
        {
          step: 'Validate & Apply to Matched Opportunities',
          duration: 'Weeks 9–12',
          focusSkills: ['Portfolio Review', 'Mock Technical Assessment'],
          outcome: 'Earn Assessor-Validated badges and apply to matched internships/jobs',
        },
      ];
    }

    return NextResponse.json({
      targetRole,
      sector: benchmark.sector,
      coveragePercent,
      currentSkills: normalizedCurrent,
      extractedFromResume,
      matchedSkills,
      missingSkills,
      summary: aiSummary,
      gapReasons,
      roadmap,
      aiPowered,
    });
  } catch (error) {
    console.error('Error in gap analysis:', error);
    return NextResponse.json({ error: 'Failed to run skill gap analysis.' }, { status: 500 });
  }
}
