// ============================================
// SKILLSYNC — Application Constants
// ============================================

export const APP_NAME = 'SkillSync';
export const APP_TAGLINE = 'Better Skills. Better Jobs. Stronger Bharat.';
export const APP_SUBTITLE = 'An evidence-driven Labour-Market Intelligence and Skill-Development Outcome Platform.';

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
export const DEMO_BANNER = 'Demo Environment — Data is simulated for demonstration purposes.';

export const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Labour Market', href: '/dashboard/labour-market', icon: 'TrendingUp' },
  { label: 'Skills', href: '/dashboard/skills', icon: 'Zap' },
  { label: 'Courses', href: '/dashboard/courses', icon: 'BookOpen' },
  { label: 'Curriculum', href: '/dashboard/curriculum', icon: 'FileText' },
  { label: 'Employers', href: '/dashboard/employers', icon: 'Building2' },
  { label: 'Candidates', href: '/dashboard/candidates', icon: 'Users' },
  { label: 'Training Outcomes', href: '/dashboard/outcomes', icon: 'Target' },
  { label: 'Districts', href: '/dashboard/districts', icon: 'MapPin' },
  { label: 'Trainers', href: '/dashboard/trainers', icon: 'GraduationCap' },
  { label: 'Equipment', href: '/dashboard/equipment', icon: 'Wrench' },
  { label: 'Recommendations', href: '/dashboard/recommendations', icon: 'Lightbulb' },
  { label: 'Kaizen Loop', href: '/dashboard/kaizen', icon: 'RefreshCw' },
  { label: 'Reports', href: '/dashboard/reports', icon: 'BarChart3' },
  { label: 'Data Sources', href: '/dashboard/data-sources', icon: 'Database' },
  { label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
] as const;

export const SECTORS = [
  'Information Technology',
  'Banking & Financial Services',
  'Healthcare',
  'Manufacturing',
  'Retail',
  'Construction',
  'Agriculture',
  'Telecommunications',
  'Automotive',
  'Electronics',
  'Energy',
  'Hospitality & Tourism',
  'Education',
  'Logistics & Transportation',
  'Media & Entertainment',
] as const;

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Chandigarh', 'Puducherry',
] as const;

export const WAGE_BANDS = [
  { label: 'Below ₹10K', min: 0, max: 10000 },
  { label: '₹10K–₹15K', min: 10000, max: 15000 },
  { label: '₹15K–₹20K', min: 15000, max: 20000 },
  { label: '₹20K–₹30K', min: 20000, max: 30000 },
  { label: '₹30K–₹50K', min: 30000, max: 50000 },
  { label: '₹50K–₹75K', min: 50000, max: 75000 },
  { label: '₹75K–₹1L', min: 75000, max: 100000 },
  { label: 'Above ₹1L', min: 100000, max: 999999 },
] as const;

export const FOLLOW_UP_SCHEDULE = [
  { type: '30_day' as const, label: '30 Days', days: 30, message: 'Have you found employment?' },
  { type: '60_day' as const, label: '60 Days', days: 60, message: 'Are you currently employed?' },
  { type: '90_day' as const, label: '90 Days', days: 90, message: 'What role are you working in?' },
  { type: '180_day' as const, label: '180 Days', days: 180, message: 'Are you still employed?' },
  { type: '365_day' as const, label: '365 Days', days: 365, message: 'What is your current employment status?' },
] as const;

export const COURSE_HEALTH_WEIGHTS = {
  industryAlignment: 0.30,
  placementPerformance: 0.25,
  skillCoverage: 0.20,
  employerSatisfaction: 0.15,
  curriculumFreshness: 0.10,
} as const;

export const NON_PLACEMENT_REASONS = [
  'Skill mismatch',
  'Lack of jobs in area',
  'Location mismatch',
  'Salary expectations mismatch',
  'Candidate preference',
  'Insufficient practical experience',
  'Certification issues',
  'Interview performance',
  'Employer-specific requirements',
  'Training quality concerns',
] as const;

export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  muted: '#94a3b8',
  palette: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'],
} as const;
