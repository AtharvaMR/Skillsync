import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { getDb } from '@/lib/db';
import { askGroqCareerAssistant, type ChatMessage } from '@/lib/ai/groq-assistant';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rate = checkRateLimit(`chat:${user.id}`, 35, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Rate limit reached. Please retry in ${rate.retryAfterSeconds}s.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const history = Array.isArray(body.history)
      ? (body.history.filter(
          (m: unknown) =>
            typeof m === 'object' &&
            m !== null &&
            ('role' in m && ((m as ChatMessage).role === 'user' || (m as ChatMessage).role === 'assistant')) &&
            'content' in m &&
            typeof (m as ChatMessage).content === 'string'
        ) as ChatMessage[])
      : [];

    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const db = getDb();
    const profile = db
      .prepare('SELECT headline, target_role, location FROM learner_profiles WHERE user_id = ?')
      .get(user.id) as { headline?: string; target_role?: string; location?: string } | undefined;

    const skills = db
      .prepare('SELECT skill_name, provenance FROM learner_skills WHERE user_id = ?')
      .all(user.id) as Array<{ skill_name: string; provenance: string }>;

    const result = await askGroqCareerAssistant({
      message,
      history,
      context: {
        name: user.name,
        headline: profile?.headline,
        targetRole: profile?.target_role,
        location: profile?.location,
        skills: skills.map((s) => ({ name: s.skill_name, provenance: s.provenance })),
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in Groq career assistant:', error);
    return NextResponse.json({ error: 'Unable to answer right now.' }, { status: 500 });
  }
}
