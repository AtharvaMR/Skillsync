import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { extractSkillsFromText } from '@/lib/ai/skill-extractor';

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
    const text = typeof body.text === 'string' ? body.text.trim() : '';

    if (!text || text.length < 10) {
      return NextResponse.json(
        { error: 'Please provide at least 10 characters of resume, project, or job text.' },
        { status: 400 }
      );
    }

    const skills = await extractSkillsFromText(text.slice(0, 12000));
    return NextResponse.json({
      skills,
    });
  } catch (error) {
    console.error('Error in skill extraction:', error);
    return NextResponse.json({ error: 'Failed to extract skills.' }, { status: 500 });
  }
}
