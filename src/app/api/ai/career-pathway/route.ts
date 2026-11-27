import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { getDefaultProvider } from '@/lib/ai/provider';

interface PathwayStep {
  stepName: string;
  description: string;
  skillsToAcquire: string[];
  estimatedDuration: string;
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
    const currentSkills = Array.isArray(body.currentSkills)
      ? body.currentSkills.filter((s: unknown) => typeof s === 'string')
      : [];
    const targetRole = typeof body.targetRole === 'string' ? body.targetRole.trim() : '';
    const experience = typeof body.experience === 'string' ? body.experience.trim() : 'Fresher';

    if (!targetRole) {
      return NextResponse.json({ error: 'targetRole is required.' }, { status: 400 });
    }

    try {
      const provider = getDefaultProvider();
      const prompt = `
        Create a 90-day step-by-step learning pathway for a learner in India.
        Current Skills: ${currentSkills.join(', ') || 'Beginner / None listed'}
        Target Role: ${targetRole}
        Experience Level: ${experience}

        Return ONLY a JSON array of 3-4 objects, each with keys:
        "stepName", "description", "skillsToAcquire" (array of strings), "estimatedDuration".
      `;
      const pathway = await provider.generateJSON<PathwayStep[]>(prompt);
      if (Array.isArray(pathway) && pathway.length > 0) {
        return NextResponse.json({ pathway, source: provider.name });
      }
    } catch (aiErr) {
      console.warn('Gemini pathway fallback triggered:', aiErr);
    }

    const fallback: PathwayStep[] = [
      {
        stepName: `Core Foundations for ${targetRole}`,
        description: 'Strengthen foundational concepts and close immediate prerequisite gaps.',
        skillsToAcquire: ['Core Problem Solving', 'Git', 'Structured Documentation'],
        estimatedDuration: 'Weeks 1–3',
      },
      {
        stepName: 'Applied Tooling & Guided Practice',
        description: `Build small practical exercises aligned with real ${targetRole} job descriptions.`,
        skillsToAcquire: ['TypeScript', 'SQL', 'REST APIs'],
        estimatedDuration: 'Weeks 4–7',
      },
      {
        stepName: 'Capstone Evidence & Assessor Validation',
        description: 'Complete an end-to-end project, upload evidence to Skill Portfolio, and request trainer validation.',
        skillsToAcquire: ['System Integration', 'Testing', 'Portfolio Presentation'],
        estimatedDuration: 'Weeks 8–12',
      },
    ];

    return NextResponse.json({ pathway: fallback, source: 'fallback' });
  } catch (error) {
    console.error('Error in career pathway:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
