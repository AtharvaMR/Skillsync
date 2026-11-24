// ============================================
// SKILLSYNC — Gap Analysis Service
// ============================================

import type { SkillGap, GapClassification } from '@/types';

export interface GapAnalysisInput {
  industrySkills: Array<{ name: string; demandScore: number }>;
  curriculumSkills: Array<{ name: string; coverageLevel: number }>;
}

export interface GapAnalysisResult {
  gaps: SkillGap[];
  summary: {
    totalSkillsAnalyzed: number;
    missingCount: number;
    underCoveredCount: number;
    adequateCount: number;
    overCoveredCount: number;
    obsoleteCount: number;
    overallAlignmentScore: number;
  };
  criticalGaps: SkillGap[];
  recommendations: string[];
}

export function classifyGap(industryDemand: number, curriculumCoverage: number): GapClassification {
  if (curriculumCoverage === 0 && industryDemand > 30) return 'missing';
  if (industryDemand - curriculumCoverage > 30) return 'under_covered';
  if (Math.abs(industryDemand - curriculumCoverage) <= 30) return 'adequate';
  if (curriculumCoverage - industryDemand > 30 && industryDemand > 20) return 'over_covered';
  if (industryDemand < 20 && curriculumCoverage > 30) return 'obsolete';
  return 'adequate';
}

export function analyzeSkillGaps(input: GapAnalysisInput): GapAnalysisResult {
  const curriculumMap = new Map(
    input.curriculumSkills.map(s => [s.name.toLowerCase(), s.coverageLevel])
  );

  const gaps: SkillGap[] = [];

  // Analyze all industry skills
  for (const skill of input.industrySkills) {
    const coverage = curriculumMap.get(skill.name.toLowerCase()) ?? 0;
    const gap = skill.demandScore - coverage;
    const classification = classifyGap(skill.demandScore, coverage);

    gaps.push({
      skillId: skill.name.toLowerCase().replace(/\s+/g, '_'),
      skillName: skill.name,
      industryDemand: skill.demandScore,
      curriculumCoverage: coverage,
      gap: Math.max(0, gap),
      classification,
    });
  }

  // Check for curriculum skills not in industry demand (potentially obsolete)
  for (const skill of input.curriculumSkills) {
    const inIndustry = input.industrySkills.find(
      s => s.name.toLowerCase() === skill.name.toLowerCase()
    );
    if (!inIndustry && skill.coverageLevel > 30) {
      gaps.push({
        skillId: skill.name.toLowerCase().replace(/\s+/g, '_'),
        skillName: skill.name,
        industryDemand: 10,
        curriculumCoverage: skill.coverageLevel,
        gap: 0,
        classification: 'obsolete',
      });
    }
  }

  // Sort by gap size descending
  gaps.sort((a, b) => b.gap - a.gap);

  const missingCount = gaps.filter(g => g.classification === 'missing').length;
  const underCoveredCount = gaps.filter(g => g.classification === 'under_covered').length;
  const adequateCount = gaps.filter(g => g.classification === 'adequate').length;
  const overCoveredCount = gaps.filter(g => g.classification === 'over_covered').length;
  const obsoleteCount = gaps.filter(g => g.classification === 'obsolete').length;

  const criticalGaps = gaps.filter(
    g => g.classification === 'missing' && g.industryDemand >= 60
  );

  // Calculate overall alignment score
  const totalDemand = gaps.reduce((sum, g) => sum + g.industryDemand, 0);
  const totalCoverage = gaps.reduce((sum, g) => sum + Math.min(g.curriculumCoverage, g.industryDemand), 0);
  const overallAlignmentScore = totalDemand > 0
    ? Math.round((totalCoverage / totalDemand) * 100)
    : 0;

  // Generate recommendations
  const recommendations: string[] = [];
  if (criticalGaps.length > 0) {
    recommendations.push(
      `Critical: ${criticalGaps.length} high-demand skills are completely missing from the curriculum.`
    );
    for (const gap of criticalGaps.slice(0, 3)) {
      recommendations.push(`Add ${gap.skillName} (industry demand: ${gap.industryDemand}%)`);
    }
  }
  if (underCoveredCount > 0) {
    recommendations.push(
      `${underCoveredCount} skills need increased coverage to match industry demand.`
    );
  }
  if (obsoleteCount > 0) {
    recommendations.push(
      `Review ${obsoleteCount} potentially obsolete skills for removal or reduction.`
    );
  }

  return {
    gaps,
    summary: {
      totalSkillsAnalyzed: gaps.length,
      missingCount,
      underCoveredCount,
      adequateCount,
      overCoveredCount,
      obsoleteCount,
      overallAlignmentScore,
    },
    criticalGaps,
    recommendations,
  };
}

// Trainer gap analysis
export interface TrainerGapResult {
  trainerName: string;
  coveredSkills: Array<{ name: string; proficiency: number }>;
  missingSkills: string[];
  gapPercentage: number;
  upskillRecommendations: string[];
}

export function analyzeTrainerGaps(
  trainerSkills: Array<{ name: string; proficiency: number }>,
  requiredSkills: string[],
  trainerName: string
): TrainerGapResult {
  const trainerSkillMap = new Map(
    trainerSkills.map(s => [s.name.toLowerCase(), s.proficiency])
  );

  const coveredSkills: Array<{ name: string; proficiency: number }> = [];
  const missingSkills: string[] = [];

  for (const required of requiredSkills) {
    const proficiency = trainerSkillMap.get(required.toLowerCase());
    if (proficiency !== undefined && proficiency >= 40) {
      coveredSkills.push({ name: required, proficiency });
    } else {
      missingSkills.push(required);
    }
  }

  const gapPercentage = requiredSkills.length > 0
    ? Math.round((missingSkills.length / requiredSkills.length) * 100)
    : 0;

  const upskillRecommendations = missingSkills.map(
    s => `Upskill in ${s} through industry training or certification programmes.`
  );

  return {
    trainerName,
    coveredSkills,
    missingSkills,
    gapPercentage,
    upskillRecommendations,
  };
}

// Equipment gap analysis
export interface EquipmentGapResult {
  courseName: string;
  requiredEquipment: string[];
  availableEquipment: string[];
  missingEquipment: string[];
  gapPercentage: number;
  recommendations: string[];
}

export function analyzeEquipmentGaps(
  courseName: string,
  requiredEquipment: string[],
  availableEquipment: string[]
): EquipmentGapResult {
  const availableSet = new Set(availableEquipment.map(e => e.toLowerCase()));
  const missingEquipment = requiredEquipment.filter(
    e => !availableSet.has(e.toLowerCase())
  );

  const gapPercentage = requiredEquipment.length > 0
    ? Math.round((missingEquipment.length / requiredEquipment.length) * 100)
    : 0;

  const recommendations = missingEquipment.map(
    e => `Prioritize procurement of ${e} for ${courseName}.`
  );

  return {
    courseName,
    requiredEquipment,
    availableEquipment,
    missingEquipment,
    gapPercentage,
    recommendations,
  };
}
