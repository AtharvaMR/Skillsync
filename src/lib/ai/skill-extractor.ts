// ============================================
// SKILLSYNC — Skill Extraction Service
// ============================================

import { getDefaultProvider } from './provider';

export interface ExtractedSkill {
  name: string;
  category: 'hard_skill' | 'soft_skill' | 'tool' | 'technology' | 'certification' | 'qualification';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  confidence: number;
}

const SYSTEM_PROMPT = `You are SkillSync's skill extraction engine. Your job is to extract skills from job descriptions, course curricula, and other text sources.

For each skill extracted, classify it into one of these categories:
- hard_skill: Technical or domain-specific abilities (e.g., Python programming, data analysis, welding)
- soft_skill: Interpersonal or cognitive abilities (e.g., communication, leadership, problem-solving)
- tool: Specific software tools (e.g., Docker, Git, Figma, AutoCAD)
- technology: Broader technology domains (e.g., Cloud Computing, IoT, Blockchain)
- certification: Industry certifications (e.g., AWS Certified, PMP, CCNA)
- qualification: Educational qualifications (e.g., B.Tech, MBA, Diploma)

Assign a proficiency level based on context:
- beginner: Basic familiarity mentioned
- intermediate: Working knowledge expected
- advanced: Deep expertise required
- expert: Thought leadership level

Assign a confidence score (0-100) based on how clearly the skill was mentioned.

Return results as a JSON array of objects with: name, category, level, confidence`;

export async function extractSkillsFromText(text: string): Promise<ExtractedSkill[]> {
  try {
    const provider = getDefaultProvider();
    const prompt = `Extract all skills from the following text. Return a JSON array.

TEXT:
${text}

Return format: [{"name": "skill name", "category": "hard_skill|soft_skill|tool|technology|certification|qualification", "level": "beginner|intermediate|advanced|expert", "confidence": 85}]`;

    const result = await provider.generateJSON<ExtractedSkill[]>(prompt, SYSTEM_PROMPT);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error('Skill extraction error:', error);
    return fallbackExtraction(text);
  }
}

// Fallback keyword-based extraction when AI is unavailable
function fallbackExtraction(text: string): ExtractedSkill[] {
  const knownSkills: Record<string, ExtractedSkill['category']> = {
    'python': 'hard_skill', 'javascript': 'hard_skill', 'java': 'hard_skill',
    'typescript': 'hard_skill', 'sql': 'hard_skill', 'html': 'hard_skill',
    'css': 'hard_skill', 'react': 'tool', 'angular': 'tool', 'vue': 'tool',
    'node.js': 'tool', 'nodejs': 'tool', 'express': 'tool', 'fastapi': 'tool',
    'django': 'tool', 'flask': 'tool', 'spring': 'tool',
    'docker': 'tool', 'kubernetes': 'tool', 'git': 'tool', 'jenkins': 'tool',
    'aws': 'technology', 'azure': 'technology', 'gcp': 'technology',
    'cloud': 'technology', 'cloud computing': 'technology',
    'machine learning': 'technology', 'deep learning': 'technology',
    'artificial intelligence': 'technology', 'ai': 'technology',
    'generative ai': 'technology', 'genai': 'technology',
    'llm': 'technology', 'nlp': 'technology',
    'data analytics': 'hard_skill', 'data science': 'hard_skill',
    'cybersecurity': 'technology', 'blockchain': 'technology',
    'iot': 'technology', 'devops': 'technology',
    'postgresql': 'tool', 'mongodb': 'tool', 'mysql': 'tool', 'redis': 'tool',
    'tensorflow': 'tool', 'pytorch': 'tool', 'pandas': 'tool', 'numpy': 'tool',
    'power bi': 'tool', 'tableau': 'tool', 'excel': 'tool',
    'figma': 'tool', 'autocad': 'tool', 'solidworks': 'tool',
    'communication': 'soft_skill', 'leadership': 'soft_skill',
    'problem solving': 'soft_skill', 'teamwork': 'soft_skill',
    'critical thinking': 'soft_skill', 'time management': 'soft_skill',
    'project management': 'soft_skill', 'agile': 'soft_skill', 'scrum': 'soft_skill',
  };

  const lowerText = text.toLowerCase();
  const extracted: ExtractedSkill[] = [];

  for (const [skill, category] of Object.entries(knownSkills)) {
    if (lowerText.includes(skill)) {
      extracted.push({
        name: skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        category,
        level: 'intermediate',
        confidence: 70,
      });
    }
  }

  return extracted;
}

export async function extractSkillsFromJobDescription(jobDescription: string): Promise<{
  skills: ExtractedSkill[];
  occupation: string;
  experienceLevel: string;
  summary: string;
}> {
  try {
    const provider = getDefaultProvider();
    const prompt = `Analyze this job description and extract:
1. All required skills (categorized)
2. The primary occupation/role
3. The experience level required
4. A brief summary

JOB DESCRIPTION:
${jobDescription}

Return as JSON with keys: skills (array), occupation (string), experienceLevel (string), summary (string)`;

    return await provider.generateJSON(prompt, SYSTEM_PROMPT);
  } catch (error) {
    console.error('Job description analysis error:', error);
    const skills = await fallbackExtraction(jobDescription);
    return {
      skills,
      occupation: 'General',
      experienceLevel: 'Not specified',
      summary: 'AI analysis unavailable',
    };
  }
}
