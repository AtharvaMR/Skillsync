// ============================================
// SKILLSYNC — Groq AI Career Assistant
// Fast conversational career guidance using GROQ_API_KEY
// ============================================

import { getSecret, sanitizeErrorMessage } from '@/lib/security/secret-locker';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LearnerChatContext {
  name: string;
  headline?: string;
  targetRole?: string;
  location?: string;
  skills: Array<{ name: string; provenance: string }>;
}

export async function askGroqCareerAssistant(input: {
  message: string;
  history?: ChatMessage[];
  context: LearnerChatContext;
}): Promise<{ reply: string; model: string; aiPowered: boolean }> {
  const apiKey = getSecret('GROQ_API_KEY');
  const skillsSummary =
    input.context.skills.length > 0
      ? input.context.skills.map((s) => `${s.name} (${s.provenance})`).join(', ')
      : 'None logged yet';

  if (!apiKey) {
    return {
      reply: `Based on your target role (${input.context.targetRole || 'entry-level tech/vocational role'}), focus on building one practical project in your Skill Portfolio and requesting trainer validation. (Configure GROQ_API_KEY on the server for live conversational guidance.)`,
      model: 'fallback',
      aiPowered: false,
    };
  }

  const systemPrompt = `You are SkillSync's AI Career Assistant for UnlockED ("Proof of Skill. Path to Opportunity.").
You help students and vocational learners—especially from underserved or tier-2/3 communities—understand skill gaps, plan practical projects, prepare for interviews/apprenticeships, and navigate careers honestly.

Rules:
- Keep answers concise, encouraging, practical, and structured in short bullet points.
- Distinguish clearly between self-declared/AI-mapped skills and assessor-validated or employer-verified skills.
- Never fabricate job offers, certifications, or real-time hiring stats.
- Never auto-decide a career for the learner; offer clear options and next practical steps.

Current Learner Context:
- Name: ${input.context.name}
- Headline: ${input.context.headline || 'Learner'}
- Target Role: ${input.context.targetRole || 'Not set'}
- Location: ${input.context.location || 'India'}
- Current Skills: ${skillsSummary}`;

  const trimmedHistory = (input.history || []).slice(-6).map((m) => ({
    role: m.role,
    content: m.content.slice(0, 1500),
  }));

  try {
    const candidateModels = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'];
    for (const modelName of candidateModels) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          temperature: 0.4,
          max_tokens: 700,
          messages: [
            { role: 'system', content: systemPrompt },
            ...trimmedHistory,
            { role: 'user', content: input.message.slice(0, 2000) },
          ],
        }),
      });

      if (!response.ok) {
        continue;
      }

      const data = (await response.json()) as {
        model?: string;
        choices?: Array<{ message?: { content?: string } }>;
      };
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (reply) {
        return {
          reply,
          model: data.model || modelName,
          aiPowered: true,
        };
      }
    }
    throw new Error('Groq models unavailable');
  } catch (err) {
    console.warn('Groq assistant fallback:', sanitizeErrorMessage(err));
    return {
      reply: `Here is a practical next step toward **${input.context.targetRole || 'your target role'}**:\n- Review your missing benchmark skills in **Skill Gap & AI**.\n- Build a small real-world project demonstrating those skills and submit it in **Skill Portfolio** so a trainer can validate it.\n- Check **Opportunities** for remote-friendly internships or apprenticeships matching your current skills.`,
      model: 'fallback',
      aiPowered: false,
    };
  }
}
