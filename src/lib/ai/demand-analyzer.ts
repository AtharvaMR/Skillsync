// ============================================
// SKILLSYNC — Demand Analysis Service
// ============================================

import type { DemandLevel, TrendDataPoint } from '@/types';

export interface DemandSignal {
  jobPostingCount: number;
  growthRate: number; // percentage
  employerFeedbackScore: number; // 0-100
  salaryRelevance: number; // 0-100
  skillFrequency: number; // 0-100
  sectorGrowth: number; // percentage
  emergingTrendScore: number; // 0-100
}

export interface DemandAnalysis {
  skillName: string;
  demandScore: number;
  demandLevel: DemandLevel;
  trend: 'rising' | 'stable' | 'falling';
  signals: DemandSignal;
  confidence: number;
  forecast: string;
  explanation: string;
}

// Weights for demand score calculation
const DEMAND_WEIGHTS = {
  jobPostingCount: 0.25,
  growthRate: 0.20,
  employerFeedbackScore: 0.15,
  salaryRelevance: 0.10,
  skillFrequency: 0.10,
  sectorGrowth: 0.10,
  emergingTrendScore: 0.10,
};

export function calculateDemandScore(signals: DemandSignal): number {
  // Normalize job posting count (cap at 100)
  const normalizedJobCount = Math.min(signals.jobPostingCount / 50 * 100, 100);
  // Normalize growth rate (cap at 100, handle negative)
  const normalizedGrowth = Math.max(Math.min((signals.growthRate + 20) / 60 * 100, 100), 0);

  const score =
    normalizedJobCount * DEMAND_WEIGHTS.jobPostingCount +
    normalizedGrowth * DEMAND_WEIGHTS.growthRate +
    signals.employerFeedbackScore * DEMAND_WEIGHTS.employerFeedbackScore +
    signals.salaryRelevance * DEMAND_WEIGHTS.salaryRelevance +
    signals.skillFrequency * DEMAND_WEIGHTS.skillFrequency +
    Math.max(Math.min((signals.sectorGrowth + 10) / 30 * 100, 100), 0) * DEMAND_WEIGHTS.sectorGrowth +
    signals.emergingTrendScore * DEMAND_WEIGHTS.emergingTrendScore;

  return Math.round(Math.max(0, Math.min(100, score)));
}

export function classifyDemandLevel(score: number, growthRate: number): DemandLevel {
  if (growthRate > 25 && score > 50) return 'emerging';
  if (score >= 75) return 'high_demand';
  if (score >= 50) return 'stable';
  if (score >= 30) return 'declining';
  return 'oversupplied';
}

export function analyzeDemand(skillName: string, signals: DemandSignal): DemandAnalysis {
  const demandScore = calculateDemandScore(signals);
  const demandLevel = classifyDemandLevel(demandScore, signals.growthRate);

  const trend: 'rising' | 'stable' | 'falling' =
    signals.growthRate > 10 ? 'rising' :
    signals.growthRate > -5 ? 'stable' : 'falling';

  const confidence = Math.round(
    (signals.jobPostingCount > 10 ? 30 : 10) +
    (signals.employerFeedbackScore > 0 ? 25 : 0) +
    (signals.skillFrequency > 20 ? 20 : 10) +
    (signals.sectorGrowth > 0 ? 15 : 5) +
    10
  );

  let forecast: string;
  let explanation: string;

  switch (demandLevel) {
    case 'high_demand':
      forecast = 'Demand expected to remain strong';
      explanation = `${skillName} shows consistently high demand across multiple signals including ${signals.jobPostingCount} recent job postings and ${signals.growthRate}% growth.`;
      break;
    case 'emerging':
      forecast = 'Rapid growth expected to continue';
      explanation = `${skillName} is an emerging skill with ${signals.growthRate}% growth and increasing employer interest.`;
      break;
    case 'stable':
      forecast = 'Steady demand expected';
      explanation = `${skillName} maintains stable demand with moderate job postings and consistent employer requirements.`;
      break;
    case 'declining':
      forecast = 'Demand may decrease further';
      explanation = `${skillName} shows declining signals with ${signals.growthRate}% growth and reducing job postings.`;
      break;
    case 'oversupplied':
      forecast = 'Market may be saturated';
      explanation = `${skillName} appears oversupplied with low demand scores relative to training output.`;
      break;
  }

  return {
    skillName,
    demandScore,
    demandLevel,
    trend,
    signals,
    confidence: Math.min(confidence, 95),
    forecast,
    explanation,
  };
}

// Generate trend data points for visualization
export function generateTrendData(
  baseValue: number,
  growthRate: number,
  months: number = 12
): TrendDataPoint[] {
  const data: TrendDataPoint[] = [];
  const now = new Date();
  const monthlyGrowth = growthRate / 100 / 12;

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);

    const variation = (Math.random() - 0.5) * 10;
    const value = Math.round(
      baseValue * (1 - monthlyGrowth * i) + variation
    );

    data.push({
      date: date.toISOString().slice(0, 7),
      value: Math.max(0, Math.min(100, value)),
    });
  }

  return data;
}

// Calculate course health score
export function calculateCourseHealthScore(components: {
  industryAlignment: number;
  placementPerformance: number;
  skillCoverage: number;
  employerSatisfaction: number;
  curriculumFreshness: number;
}): number {
  const weights = {
    industryAlignment: 0.30,
    placementPerformance: 0.25,
    skillCoverage: 0.20,
    employerSatisfaction: 0.15,
    curriculumFreshness: 0.10,
  };

  return Math.round(
    components.industryAlignment * weights.industryAlignment +
    components.placementPerformance * weights.placementPerformance +
    components.skillCoverage * weights.skillCoverage +
    components.employerSatisfaction * weights.employerSatisfaction +
    components.curriculumFreshness * weights.curriculumFreshness
  );
}
