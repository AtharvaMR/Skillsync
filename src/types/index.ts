// ============================================
// SKILLSYNC — Core Type Definitions
// ============================================

// ---- User & Auth Types ----
export type UserRole = 'government' | 'institute' | 'trainer' | 'employer' | 'student' | 'analyst';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organisationId?: string;
  organisationName?: string;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

// ---- Skill Types ----
export type SkillCategory = 'hard_skill' | 'soft_skill' | 'tool' | 'technology' | 'certification' | 'qualification';
export type DemandLevel = 'high_demand' | 'emerging' | 'stable' | 'declining' | 'oversupplied';
export type GapClassification = 'missing' | 'under_covered' | 'adequate' | 'over_covered' | 'obsolete';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  demandScore: number;
  growthRate: number;
  demandLevel: DemandLevel;
  relatedOccupations: string[];
  relatedCourses: string[];
}

export interface SkillRelationship {
  skillId: string;
  relatedSkillId: string;
  relationshipType: 'parent' | 'child' | 'related' | 'prerequisite' | 'complementary';
}

export interface SkillGap {
  skillId: string;
  skillName: string;
  industryDemand: number;
  curriculumCoverage: number;
  gap: number;
  classification: GapClassification;
}

// ---- Job Types ----
export interface Job {
  id: string;
  employerId: string;
  employerName: string;
  occupationId: string;
  title: string;
  description: string;
  location: string;
  district: string;
  state: string;
  salaryBand: string;
  skills: string[];
  postedAt: string;
  source: string;
}

// ---- Employer Types ----
export type EmployerSize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';

export interface Employer {
  id: string;
  name: string;
  sector: string;
  location: string;
  size: EmployerSize;
  hiringDemand: number;
  satisfactionScore: number;
}

export interface EmployerFeedback {
  id: string;
  employerId: string;
  employerName: string;
  courseId?: string;
  skillId?: string;
  feedbackType: 'curriculum' | 'candidate' | 'skill_gap' | 'general';
  rating: number;
  comments: string;
  createdAt: string;
}

// ---- Course Types ----
export type CourseHealthLevel = 'excellent' | 'good' | 'needs_attention' | 'critical';

export interface Course {
  id: string;
  instituteId: string;
  instituteName: string;
  name: string;
  description: string;
  sector: string;
  duration: string;
  healthScore: number;
  healthLevel: CourseHealthLevel;
  healthBreakdown: CourseHealthBreakdown;
  enrolledCount: number;
  completedCount: number;
  placedCount: number;
}

export interface CourseHealthBreakdown {
  industryAlignment: number;
  skillCoverage: number;
  emergingSkillCoverage: number;
  placementPerformance: number;
  employerSatisfaction: number;
  curriculumFreshness: number;
}

export interface CourseModule {
  id: string;
  courseId: string;
  name: string;
  description: string;
  skills: string[];
  order: number;
}

export interface CourseSkill {
  courseId: string;
  skillId: string;
  skillName: string;
  coverageLevel: number; // 0–100
}

// ---- Occupation Types ----
export interface Occupation {
  id: string;
  name: string;
  sector: string;
  description: string;
  requiredSkills: string[];
  demandScore: number;
}

// ---- Candidate Types ----
export type EmploymentStatus =
  | 'placed'
  | 'employed'
  | 'self_employed'
  | 'apprenticeship'
  | 'unemployed'
  | 'dropped_out'
  | 'seeking_employment'
  | 'unknown';

export type ConsentStatus = 'granted' | 'withdrawn' | 'pending';

export interface Candidate {
  id: string;
  anonymizedId: string;
  name?: string;
  gender?: string;
  ageGroup?: string;
  districtId: string;
  districtName: string;
  state: string;
  consentStatus: ConsentStatus;
  skills: string[];
  courses: string[];
  certifications: string[];
  employmentStatus: EmploymentStatus;
  createdAt: string;
}

export interface EmploymentOutcome {
  id: string;
  candidateId: string;
  employmentStatus: EmploymentStatus;
  employerId?: string;
  employerName?: string;
  occupationId?: string;
  occupationName?: string;
  wageBand: string;
  location: string;
  startDate: string;
  retentionMonths: number;
  retentionStatus: 'active' | 'left' | 'unknown';
  trainingRelevance: number; // 0–100
  skillUtilization: number; // 0–100
  satisfaction: number; // 1–5
  recordedAt: string;
}

export interface FollowUp {
  id: string;
  candidateId: string;
  followUpType: '30_day' | '60_day' | '90_day' | '180_day' | '365_day';
  scheduledAt: string;
  completedAt?: string;
  response?: string;
  status: 'pending' | 'completed' | 'no_response' | 'declined';
}

// ---- Placement Types ----
export interface Placement {
  id: string;
  candidateId: string;
  employerId: string;
  employerName: string;
  occupationId: string;
  occupationName: string;
  placementDate: string;
  status: 'placed' | 'joined' | 'declined' | 'terminated';
}

export interface PlacementFunnel {
  enrolled: number;
  completed: number;
  certified: number;
  placed: number;
  employed: number;
  retained: number;
}

// ---- Trainer Types ----
export interface Trainer {
  id: string;
  instituteId: string;
  instituteName: string;
  name: string;
  skills: TrainerSkill[];
  gapSkills: string[];
  upskillRecommendations: string[];
}

export interface TrainerSkill {
  skillId: string;
  skillName: string;
  proficiency: number; // 0–100
}

// ---- Equipment Types ----
export interface Equipment {
  id: string;
  instituteId: string;
  instituteName: string;
  name: string;
  category: string;
  availability: 'available' | 'limited' | 'unavailable';
  condition: 'good' | 'fair' | 'poor';
}

export interface EquipmentGap {
  courseId: string;
  courseName: string;
  equipmentName: string;
  required: boolean;
  available: boolean;
  recommendation: string;
}

// ---- District Types ----
export interface District {
  id: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  topSkills: string[];
  topOccupations: string[];
  emergingSkills: string[];
  decliningSkills: string[];
  placementRate: number;
  trainingSupply: 'high' | 'medium' | 'low';
  labourDemand: 'high' | 'medium' | 'low';
  skillGaps: string[];
}

// ---- Recommendation Types ----
export type RecommendationType = 'add' | 'remove' | 'update' | 'reorder' | 'retrain' | 'invest';
export type ValidationStatus = 'pending' | 'validated' | 'rejected' | 'modified';
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type EntityType = 'course' | 'trainer' | 'equipment' | 'district' | 'candidate' | 'employer';
export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Recommendation {
  id: string;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  recommendationType: RecommendationType;
  title: string;
  recommendation: string;
  evidence: string[];
  reason: string;
  impact: string;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  priority: PriorityLevel;
  validationStatus: ValidationStatus;
  employerApprovalRate?: number;
  dataSources: string[];
  createdAt: string;
}

// ---- Kaizen Types ----
export interface KaizenCycle {
  id: string;
  cycleNumber: number;
  phase: 'plan' | 'do' | 'check' | 'act';
  startDate: string;
  endDate?: string;
  observations: string[];
  actions: string[];
  outcomes: string[];
  improvements: KaizenImprovement[];
  nextActions: string[];
}

export interface KaizenImprovement {
  metric: string;
  before: number;
  after: number;
  changePercent: number;
  direction: 'improved' | 'declined' | 'stable';
}

// ---- Data Source Types ----
export type DataSourceStatus = 'connected' | 'active' | 'imported' | 'disconnected' | 'error';
export type DataSourceType = 'api' | 'csv' | 'json' | 'excel' | 'manual' | 'survey';

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  status: DataSourceStatus;
  lastSync: string;
  recordsCount: number;
  dataQualityScore: number;
}

export interface IngestionJob {
  id: string;
  sourceId: string;
  sourceName: string;
  status: 'running' | 'completed' | 'failed' | 'queued';
  recordsProcessed: number;
  recordsFailed: number;
  startedAt: string;
  completedAt?: string;
}

// ---- Notification Types ----
export type NotificationType = 'info' | 'warning' | 'critical' | 'success';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

// ---- Analytics Types ----
export interface KPI {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  category: 'labour_market' | 'curriculum' | 'training' | 'employment' | 'employer' | 'impact';
}

export interface TrendDataPoint {
  date: string;
  value: number;
}

export interface WageBand {
  label: string;
  min: number;
  max: number;
}

export interface WageProgression {
  period: string;
  wageBand: WageBand;
  count: number;
}

export interface NonPlacementReason {
  reason: string;
  count: number;
  percentage: number;
}

// ---- Career Pathway Types ----
export interface CareerPathway {
  currentSkills: string[];
  targetOccupation: string;
  readinessPercent: number;
  missingSkills: string[];
  recommendedCourses: string[];
  steps: CareerStep[];
  relevantJobs: string[];
}

export interface CareerStep {
  order: number;
  type: 'skill' | 'course' | 'certification' | 'experience';
  name: string;
  description: string;
  estimatedDuration: string;
}

// ---- Report Types ----
export type ReportType =
  | 'government_impact'
  | 'district_skill_gap'
  | 'course_health'
  | 'employer_demand'
  | 'placement_outcome'
  | 'trainer_gap'
  | 'equipment_gap'
  | 'emerging_skills';

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  generatedAt: string;
  summary: string;
  kpis: KPI[];
  findings: string[];
  recommendations: string[];
  dataFreshness: string;
  methodology: string;
  limitations: string[];
}
