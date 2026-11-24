// ============================================
// SKILLSYNC — Recommendation Engine
// ============================================

import { getDefaultProvider } from './provider';
import type { Recommendation, ConfidenceLevel, PriorityLevel } from '@/types';

const SYSTEM_PROMPT = `You are SkillSync's curriculum recommendation engine. You analyze skill gaps between industry demand and training curriculum to generate actionable, evidence-based recommendations.

Your recommendations must follow these principles:
1. Every recommendation must be explainable with evidence
2. Clearly distinguish between AI inference and validated facts
3. Never present recommendations as absolute truths
4. Include confidence levels based on data strength
5. Prioritize based on impact and urgency

Recommendation types:
- ADD: Add new content/skill to curriculum
- REMOVE: Remove obsolete content
- UPDATE: Modernize existing content
- REORDER: Change teaching sequence
- RETRAIN: Trainer needs upskilling
- INVEST: Equipment/infrastructure investment needed`;

export interface CurriculumRecommendationInput {
  courseName: string;
  courseModules: string[];
  courseSkills: string[];
  industryDemandSkills: Array<{ name: string; demandScore: number }>;
  employerFeedback?: string[];
  placementRate?: number;
  healthScore?: number;
}

export interface CurriculumRecommendation {
  type: 'add' | 'remove' | 'update' | 'reorder' | 'retrain' | 'invest';
  title: string;
  description: string;
  priority: PriorityLevel;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  evidence: string[];
  impact: string;
  skillsAffected: string[];
}

export async function generateCurriculumRecommendations(
  input: CurriculumRecommendationInput
): Promise<CurriculumRecommendation[]> {
  try {
    const provider = getDefaultProvider();

    const prompt = `Analyze this course and generate curriculum recommendations.

COURSE: ${input.courseName}
CURRENT MODULES: ${input.courseModules.join(', ')}
CURRENT SKILLS COVERED: ${input.courseSkills.join(', ')}
INDUSTRY DEMAND SKILLS: ${input.industryDemandSkills.map(s => `${s.name} (demand: ${s.demandScore})`).join(', ')}
${input.employerFeedback ? `EMPLOYER FEEDBACK: ${input.employerFeedback.join('; ')}` : ''}
${input.placementRate !== undefined ? `PLACEMENT RATE: ${input.placementRate}%` : ''}
${input.healthScore !== undefined ? `COURSE HEALTH SCORE: ${input.healthScore}%` : ''}

Generate 3-6 specific, actionable recommendations. For each:
1. Identify what should be added, removed, updated, reordered, or what training/investment is needed
2. Explain why with evidence
3. Assess priority and confidence
4. Describe expected impact

Return as JSON array with keys: type, title, description, priority, confidence, confidenceScore, evidence (array), impact, skillsAffected (array)`;

    const result = await provider.generateJSON<CurriculumRecommendation[]>(prompt, SYSTEM_PROMPT);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error('Recommendation generation error:', error);
    return generateFallbackRecommendations(input);
  }
}

function generateFallbackRecommendations(input: CurriculumRecommendationInput): CurriculumRecommendation[] {
  const recommendations: CurriculumRecommendation[] = [];
  const coveredSet = new Set(input.courseSkills.map(s => s.toLowerCase()));

  // Find high-demand skills not in curriculum
  const missingHighDemand = input.industryDemandSkills.filter(
    s => s.demandScore >= 70 && !coveredSet.has(s.name.toLowerCase())
  );

  for (const skill of missingHighDemand.slice(0, 3)) {
    recommendations.push({
      type: 'add',
      title: `Add ${skill.name} module`,
      description: `${skill.name} has a demand score of ${skill.demandScore} but is not currently covered in the curriculum.`,
      priority: skill.demandScore >= 85 ? 'critical' : 'high',
      confidence: 'medium',
      confidenceScore: 65,
      evidence: [`Industry demand score: ${skill.demandScore}`, 'Not present in current curriculum'],
      impact: `Improved industry alignment and placement potential for ${skill.name}-related roles`,
      skillsAffected: [skill.name],
    });
  }

  if (input.healthScore && input.healthScore < 70) {
    recommendations.push({
      type: 'update',
      title: 'Comprehensive curriculum review needed',
      description: `Course health score (${input.healthScore}%) indicates significant alignment issues.`,
      priority: 'high',
      confidence: 'high',
      confidenceScore: 80,
      evidence: [`Course health score: ${input.healthScore}%`, 'Below recommended threshold of 70%'],
      impact: 'Improved overall course effectiveness and placement outcomes',
      skillsAffected: input.courseSkills,
    });
  }

  return recommendations;
}

export async function generateCareerPathway(
  currentSkills: string[],
  targetOccupation: string,
  availableCourses?: string[]
): Promise<{
  readinessPercent: number;
  missingSkills: string[];
  steps: Array<{ order: number; type: string; name: string; description: string; duration: string }>;
  relevantJobs: string[];
}> {
  try {
    const provider = getDefaultProvider();

    const prompt = `Generate a career pathway for a candidate.

CURRENT SKILLS: ${currentSkills.join(', ')}
TARGET OCCUPATION: ${targetOccupation}
${availableCourses ? `AVAILABLE COURSES: ${availableCourses.join(', ')}` : ''}

Generate:
1. Readiness percentage (0-100)
2. Missing skills needed
3. Step-by-step learning pathway (4-8 steps)
4. Relevant job titles they could apply for

Return as JSON with keys: readinessPercent, missingSkills (array), steps (array of {order, type, name, description, duration}), relevantJobs (array)`;

    return await provider.generateJSON(prompt, SYSTEM_PROMPT);
  } catch (error) {
    console.error('Career pathway generation error:', error);
    return {
      readinessPercent: 45,
      missingSkills: ['Advanced skills analysis unavailable'],
      steps: [
        { order: 1, type: 'skill', name: 'Assess current skills', description: 'Complete a skills assessment', duration: '1 week' },
        { order: 2, type: 'course', name: 'Bridge course', description: 'Enroll in a relevant bridge course', duration: '2 months' },
        { order: 3, type: 'certification', name: 'Industry certification', description: 'Obtain relevant industry certification', duration: '1 month' },
        { order: 4, type: 'experience', name: 'Practical project', description: 'Complete a hands-on project', duration: '1 month' },
      ],
      relevantJobs: [targetOccupation],
    };
  }
}
