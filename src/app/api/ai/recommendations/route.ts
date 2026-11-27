import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { getDefaultProvider } from '@/lib/ai/provider';

interface RecommendationItem {
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'High' | 'Medium' | 'Low';
  rationale?: string;
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
    const courseName = typeof body.courseName === 'string' ? body.courseName.trim() : '';
    const sector = typeof body.sector === 'string' ? body.sector.trim() : 'General';
    const skills = Array.isArray(body.skills) ? body.skills.filter((s: unknown) => typeof s === 'string') : [];

    if (!courseName) {
      return NextResponse.json({ error: 'courseName is required.' }, { status: 400 });
    }

    try {
      const provider = getDefaultProvider();
      const prompt = `
        Generate 3 practical, evidence-oriented curriculum recommendations for an Indian skilling/vocational course.
        Course: ${courseName}
        Sector: ${sector}
        Current Skills Covered: ${skills.join(', ') || 'None specified'}

        Return ONLY a JSON array of objects with keys:
        "title", "description", "impact" ("High"|"Medium"|"Low"), "effort" ("High"|"Medium"|"Low"), "rationale".
      `;
      const recommendations = await provider.generateJSON<RecommendationItem[]>(prompt);
      if (Array.isArray(recommendations) && recommendations.length > 0) {
        return NextResponse.json({ recommendations, source: provider.name });
      }
    } catch (aiErr) {
      console.warn('Gemini recommendations fallback triggered:', aiErr);
    }

    const fallback: RecommendationItem[] = [
      {
        title: `Add Practical Capstone Project to ${courseName}`,
        description: `Require learners to complete a documented, employer-reviewable project demonstrating applied ${sector} skills.`,
        impact: 'High',
        effort: 'Medium',
        rationale: 'Practical work artifacts enable assessor validation and improve employer hiring confidence.',
      },
      {
        title: 'Integrate Industry Tooling & Versioned Workflows',
        description: `Embed current ${sector} tools and diagnostic/testing practices into weekly lab hours.`,
        impact: 'High',
        effort: 'Medium',
        rationale: 'Reduces onboarding gap reported by regional employers.',
      },
      {
        title: 'Schedule Employer Curriculum Review (PDCA Check)',
        description: `Conduct a quarterly alignment check with 2–3 hiring partners in ${sector}.`,
        impact: 'Medium',
        effort: 'Low',
        rationale: 'Keeps syllabus aligned with evolving job descriptions.',
      },
    ];

    return NextResponse.json({ recommendations: fallback, source: 'fallback' });
  } catch (error) {
    console.error('Error in recommendations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
