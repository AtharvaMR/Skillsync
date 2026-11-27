// ============================================
// SKILLSYNC — Persistent SQLite Database Layer
// ============================================

import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import type { User, UserRole } from '@/types';

declare global {
  var __skillsyncDb: Database.Database | undefined;
}

function resolveDbPath(): string {
  const raw = process.env.DATABASE_URL || 'file:./dev.db';
  const cleaned = raw.replace(/^file:/, '');
  return path.isAbsolute(cleaned) ? cleaned : path.resolve(process.cwd(), cleaned);
}

export function getDb(): Database.Database {
  if (globalThis.__skillsyncDb) {
    return globalThis.__skillsyncDb;
  }

  const dbPath = resolveDbPath();
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  initializeSchema(db);
  seedDatabaseIfEmpty(db);

  globalThis.__skillsyncDb = db;
  return db;
}

function initializeSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('government', 'institute', 'trainer', 'employer', 'student', 'analyst')),
      organisation_id TEXT,
      organisation_name TEXT,
      location TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS learner_profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      headline TEXT NOT NULL DEFAULT '',
      bio TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      district TEXT NOT NULL DEFAULT '',
      state TEXT NOT NULL DEFAULT '',
      education_level TEXT NOT NULL DEFAULT 'Undergraduate / Diploma',
      experience_level TEXT NOT NULL DEFAULT 'Fresher / Entry-level',
      target_role TEXT NOT NULL DEFAULT 'Full Stack Web Developer',
      interests TEXT NOT NULL DEFAULT '',
      strengths TEXT NOT NULL DEFAULT '',
      societal_needs TEXT NOT NULL DEFAULT '',
      career_goals TEXT NOT NULL DEFAULT '',
      portfolio_public INTEGER NOT NULL DEFAULT 1,
      consent_tracking INTEGER NOT NULL DEFAULT 1,
      resume_filename TEXT,
      resume_text TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS learner_skills (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      skill_name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'hard_skill',
      proficiency TEXT NOT NULL DEFAULT 'intermediate',
      provenance TEXT NOT NULL CHECK (provenance IN ('self_declared', 'ai_mapped', 'assessor_validated', 'employer_verified')),
      evidence_note TEXT NOT NULL DEFAULT '',
      validated_by TEXT,
      validated_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS portfolio_projects (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      role_in_project TEXT NOT NULL DEFAULT '',
      skills_json TEXT NOT NULL DEFAULT '[]',
      demo_url TEXT NOT NULL DEFAULT '',
      attachment_path TEXT,
      attachment_name TEXT,
      attachment_mime TEXT,
      status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'validated', 'needs_revision')),
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS assessments (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES portfolio_projects(id) ON DELETE CASCADE,
      learner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      assessor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      assessor_name TEXT NOT NULL,
      assessor_role TEXT NOT NULL,
      decision TEXT NOT NULL CHECK (decision IN ('approved', 'needs_revision', 'rejected')),
      validated_skills_json TEXT NOT NULL DEFAULT '[]',
      rubric_score INTEGER NOT NULL DEFAULT 0,
      feedback TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS opportunities (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      employer_id TEXT NOT NULL,
      employer_name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('internship', 'apprenticeship', 'entry_level_job', 'training_program')),
      sector TEXT NOT NULL,
      location TEXT NOT NULL,
      district TEXT NOT NULL,
      state TEXT NOT NULL,
      is_remote INTEGER NOT NULL DEFAULT 0,
      stipend_or_salary TEXT NOT NULL,
      experience_required TEXT NOT NULL,
      eligibility TEXT NOT NULL,
      required_skills_json TEXT NOT NULL DEFAULT '[]',
      description TEXT NOT NULL,
      posted_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS opportunity_applications (
      id TEXT PRIMARY KEY,
      opportunity_id TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'applied',
      match_score INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      UNIQUE(opportunity_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      institute_id TEXT NOT NULL,
      institute_name TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      sector TEXT NOT NULL,
      duration TEXT NOT NULL,
      health_score INTEGER NOT NULL,
      health_level TEXT NOT NULL,
      breakdown_json TEXT NOT NULL,
      required_skills_json TEXT NOT NULL DEFAULT '[]',
      enrolled_count INTEGER NOT NULL DEFAULT 0,
      completed_count INTEGER NOT NULL DEFAULT 0,
      placed_count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS skills_catalog (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      demand_score INTEGER NOT NULL,
      growth_rate INTEGER NOT NULL,
      demand_level TEXT NOT NULL,
      sector TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS employer_feedback (
      id TEXT PRIMARY KEY,
      employer_id TEXT NOT NULL,
      employer_name TEXT NOT NULL,
      course_id TEXT,
      skill_name TEXT,
      feedback_type TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comments TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS kaizen_cycles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      phase TEXT NOT NULL CHECK (phase IN ('plan', 'do', 'check', 'act')),
      category TEXT NOT NULL,
      status TEXT NOT NULL,
      evidence TEXT NOT NULL,
      impact_metric TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS uploaded_files (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      original_name TEXT NOT NULL,
      stored_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      purpose TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}

function seedDatabaseIfEmpty(db: Database.Database) {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count > 0) return;

  const defaultHash = bcrypt.hashSync('SkillSync2024!', 10);

  const seedUsers = [
    {
      id: 'usr_gov_001',
      name: 'Dr. Rajesh Kumar',
      email: 'admin@skillsync.gov.in',
      role: 'government',
      organisation_id: 'org_gov_001',
      organisation_name: 'Ministry of Skill Development & Entrepreneurship',
      location: 'New Delhi, Delhi',
      created_at: '2025-01-15T10:00:00Z',
    },
    {
      id: 'usr_inst_001',
      name: 'Prof. Anita Sharma',
      email: 'institute@skillsync.gov.in',
      role: 'institute',
      organisation_id: 'org_inst_001',
      organisation_name: 'Don Bosco Institute of Technology & Skill Centre',
      location: 'Bengaluru, Karnataka',
      created_at: '2025-02-01T10:00:00Z',
    },
    {
      id: 'usr_trn_001',
      name: 'Vikram Mehta',
      email: 'trainer@skillsync.gov.in',
      role: 'trainer',
      organisation_id: 'org_inst_001',
      organisation_name: 'Don Bosco Institute of Technology & Skill Centre',
      location: 'Bengaluru, Karnataka',
      created_at: '2025-02-15T10:00:00Z',
    },
    {
      id: 'usr_emp_001',
      name: 'Priya Nair',
      email: 'employer@skillsync.gov.in',
      role: 'employer',
      organisation_id: 'org_emp_001',
      organisation_name: 'Tata Consultancy Services',
      location: 'Bengaluru, Karnataka',
      created_at: '2025-03-01T10:00:00Z',
    },
    {
      id: 'usr_stu_001',
      name: 'Arjun Patel',
      email: 'student@skillsync.gov.in',
      role: 'student',
      organisation_id: 'org_inst_001',
      organisation_name: 'Government Polytechnic & Skill Hub, Hubballi',
      location: 'Hubballi, Karnataka',
      created_at: '2025-04-01T10:00:00Z',
    },
    {
      id: 'usr_ana_001',
      name: 'Meera Iyer',
      email: 'analyst@skillsync.gov.in',
      role: 'analyst',
      organisation_id: 'org_gov_001',
      organisation_name: 'Ministry of Skill Development & Entrepreneurship',
      location: 'New Delhi, Delhi',
      created_at: '2025-04-15T10:00:00Z',
    },
  ];

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password_hash, role, organisation_id, organisation_name, location, created_at)
    VALUES (@id, @name, @email, @password_hash, @role, @organisation_id, @organisation_name, @location, @created_at)
  `);

  const insertProfile = db.prepare(`
    INSERT INTO learner_profiles (
      user_id, headline, bio, location, district, state, education_level, experience_level,
      target_role, interests, strengths, societal_needs, career_goals, portfolio_public, consent_tracking, updated_at
    ) VALUES (
      @user_id, @headline, @bio, @location, @district, @state, @education_level, @experience_level,
      @target_role, @interests, @strengths, @societal_needs, @career_goals, @portfolio_public, @consent_tracking, @updated_at
    )
  `);

  const insertSkill = db.prepare(`
    INSERT INTO learner_skills (id, user_id, skill_name, category, proficiency, provenance, evidence_note, validated_by, validated_at, created_at)
    VALUES (@id, @user_id, @skill_name, @category, @proficiency, @provenance, @evidence_note, @validated_by, @validated_at, @created_at)
  `);

  const insertProject = db.prepare(`
    INSERT INTO portfolio_projects (id, user_id, title, description, role_in_project, skills_json, demo_url, status, created_at)
    VALUES (@id, @user_id, @title, @description, @role_in_project, @skills_json, @demo_url, @status, @created_at)
  `);

  const insertAssessment = db.prepare(`
    INSERT INTO assessments (id, project_id, learner_id, assessor_id, assessor_name, assessor_role, decision, validated_skills_json, rubric_score, feedback, created_at)
    VALUES (@id, @project_id, @learner_id, @assessor_id, @assessor_name, @assessor_role, @decision, @validated_skills_json, @rubric_score, @feedback, @created_at)
  `);

  const insertOpportunity = db.prepare(`
    INSERT INTO opportunities (id, title, employer_id, employer_name, type, sector, location, district, state, is_remote, stipend_or_salary, experience_required, eligibility, required_skills_json, description, posted_at)
    VALUES (@id, @title, @employer_id, @employer_name, @type, @sector, @location, @district, @state, @is_remote, @stipend_or_salary, @experience_required, @eligibility, @required_skills_json, @description, @posted_at)
  `);

  const insertCatalogSkill = db.prepare(`
    INSERT INTO skills_catalog (id, name, category, description, demand_score, growth_rate, demand_level, sector)
    VALUES (@id, @name, @category, @description, @demand_score, @growth_rate, @demand_level, @sector)
  `);

  const insertCourse = db.prepare(`
    INSERT INTO courses (id, institute_id, institute_name, name, description, sector, duration, health_score, health_level, breakdown_json, required_skills_json, enrolled_count, completed_count, placed_count)
    VALUES (@id, @institute_id, @institute_name, @name, @description, @sector, @duration, @health_score, @health_level, @breakdown_json, @required_skills_json, @enrolled_count, @completed_count, @placed_count)
  `);

  const insertFeedback = db.prepare(`
    INSERT INTO employer_feedback (id, employer_id, employer_name, course_id, skill_name, feedback_type, rating, comments, created_at)
    VALUES (@id, @employer_id, @employer_name, @course_id, @skill_name, @feedback_type, @rating, @comments, @created_at)
  `);

  const insertKaizen = db.prepare(`
    INSERT INTO kaizen_cycles (id, title, phase, category, status, evidence, impact_metric, created_at)
    VALUES (@id, @title, @phase, @category, @status, @evidence, @impact_metric, @created_at)
  `);

  const txn = db.transaction(() => {
    for (const u of seedUsers) {
      insertUser.run({ ...u, password_hash: defaultHash });
    }

    insertProfile.run({
      user_id: 'usr_stu_001',
      headline: 'Diploma CS Graduate & Aspiring Full Stack Developer',
      bio: 'First-generation vocational learner from Hubballi building web and community-focused digital tools.',
      location: 'Hubballi, Karnataka',
      district: 'Dharwad',
      state: 'Karnataka',
      education_level: 'Diploma in Computer Science',
      experience_level: 'Fresher (0-1 years)',
      target_role: 'Full Stack Web Developer',
      interests: 'Web applications, open-source tools, local commerce digitization',
      strengths: 'Problem solving, HTML/CSS, React fundamentals, fast learner',
      societal_needs: 'Affordable digital tools for rural schools and small local businesses',
      career_goals: 'Join an engineering team as a Junior Full Stack Developer within 90 days',
      portfolio_public: 1,
      consent_tracking: 1,
      updated_at: '2026-11-20T10:00:00Z',
    });

    const sampleSkills = [
      { id: 'lsk_001', user_id: 'usr_stu_001', skill_name: 'JavaScript', category: 'technology', proficiency: 'intermediate', provenance: 'assessor_validated', evidence_note: 'Validated in Gramin Bazaar web project', validated_by: 'Vikram Mehta (Trainer)', validated_at: '2026-11-12T10:00:00Z', created_at: '2026-10-15T10:00:00Z' },
      { id: 'lsk_002', user_id: 'usr_stu_001', skill_name: 'React', category: 'technology', proficiency: 'intermediate', provenance: 'assessor_validated', evidence_note: 'Built responsive product catalog & cart UI', validated_by: 'Vikram Mehta (Trainer)', validated_at: '2026-11-12T10:00:00Z', created_at: '2026-10-15T10:00:00Z' },
      { id: 'lsk_003', user_id: 'usr_stu_001', skill_name: 'HTML/CSS', category: 'hard_skill', proficiency: 'advanced', provenance: 'employer_verified', evidence_note: 'Verified during TCS regional assessment sprint', validated_by: 'Priya Nair (TCS)', validated_at: '2026-11-18T10:00:00Z', created_at: '2026-10-01T10:00:00Z' },
      { id: 'lsk_004', user_id: 'usr_stu_001', skill_name: 'SQL', category: 'hard_skill', proficiency: 'beginner', provenance: 'ai_mapped', evidence_note: 'Extracted from coursework & project schema notes', validated_by: null, validated_at: null, created_at: '2026-11-10T10:00:00Z' },
      { id: 'lsk_005', user_id: 'usr_stu_001', skill_name: 'Git', category: 'tool', proficiency: 'intermediate', provenance: 'self_declared', evidence_note: 'Used for personal project version control', validated_by: null, validated_at: null, created_at: '2026-11-05T10:00:00Z' },
    ];
    for (const s of sampleSkills) insertSkill.run(s);

    insertProject.run({
      id: 'prj_001',
      user_id: 'usr_stu_001',
      title: 'Gramin Bazaar — Local Kirana Inventory & Order Portal',
      description: 'Low-bandwidth web app helping neighborhood stores in Dharwad list stock and accept pickup orders from mobile phones.',
      role_in_project: 'Frontend & UI Developer',
      skills_json: JSON.stringify(['JavaScript', 'React', 'HTML/CSS']),
      demo_url: 'https://github.com/AtharvaMR/Skillsync',
      status: 'validated',
      created_at: '2026-11-10T09:00:00Z',
    });

    insertProject.run({
      id: 'prj_002',
      user_id: 'usr_stu_001',
      title: 'District Attendance & Scholarship Eligibility Checker',
      description: 'SQL + API prototype tracking student attendance milestones and surfacing eligible state scholarship schemes.',
      role_in_project: 'Solo Developer',
      skills_json: JSON.stringify(['SQL', 'REST APIs', 'TypeScript']),
      demo_url: '',
      status: 'submitted',
      created_at: '2026-11-22T14:00:00Z',
    });

    insertAssessment.run({
      id: 'asm_001',
      project_id: 'prj_001',
      learner_id: 'usr_stu_001',
      assessor_id: 'usr_trn_001',
      assessor_name: 'Vikram Mehta',
      assessor_role: 'trainer',
      decision: 'approved',
      validated_skills_json: JSON.stringify(['JavaScript', 'React']),
      rubric_score: 88,
      feedback: 'Clean mobile-first layout and strong component structure. Next step: add unit tests and backend API validation.',
      created_at: '2026-11-12T10:00:00Z',
    });

    const curatedOpportunities = [
      {
        id: 'opp_001',
        title: 'Junior Frontend Engineering Intern',
        employer_id: 'usr_emp_001',
        employer_name: 'Tata Consultancy Services',
        type: 'internship',
        sector: 'Information Technology',
        location: 'Bengaluru, Karnataka',
        district: 'Bengaluru Urban',
        state: 'Karnataka',
        is_remote: 1,
        stipend_or_salary: '₹18,000 / month',
        experience_required: 'Fresher (0-1 years)',
        eligibility: 'Diploma / B.E. / B.Sc. / Vocational CS graduates',
        required_skills_json: JSON.stringify(['JavaScript', 'React', 'HTML/CSS', 'Git', 'TypeScript']),
        description: 'Work with TCS Digital Experience teams building accessible React web portals for public-sector and enterprise clients.',
        posted_at: '2026-11-20T09:00:00Z',
      },
      {
        id: 'opp_002',
        title: 'Full Stack Web Developer (Entry-Level)',
        employer_id: 'emp_002',
        employer_name: 'Infosys Springboard Partner Network',
        type: 'entry_level_job',
        sector: 'Information Technology',
        location: 'Mysuru, Karnataka',
        district: 'Mysuru',
        state: 'Karnataka',
        is_remote: 0,
        stipend_or_salary: '₹4.2 LPA',
        experience_required: '0-1 years',
        eligibility: 'Any graduate or NSDC/ITI certified web developer with portfolio project',
        required_skills_json: JSON.stringify(['JavaScript', 'React', 'Node.js', 'SQL', 'REST APIs', 'TypeScript']),
        description: 'Build and maintain internal learning and talent tools using React, Node.js, and SQL databases.',
        posted_at: '2026-11-19T11:30:00Z',
      },
      {
        id: 'opp_003',
        title: 'Data & Cloud Operations Apprenticeship',
        employer_id: 'emp_003',
        employer_name: 'Wipro',
        type: 'apprenticeship',
        sector: 'Information Technology',
        location: 'Pune, Maharashtra',
        district: 'Pune',
        state: 'Maharashtra',
        is_remote: 1,
        stipend_or_salary: '₹22,000 / month',
        experience_required: 'Fresher',
        eligibility: 'Graduates / Diploma holders under NAPS apprenticeship scheme',
        required_skills_json: JSON.stringify(['Python', 'SQL', 'Cloud Computing', 'Linux', 'Docker']),
        description: '12-month NAPS-aligned apprenticeship covering SQL reporting, Python automation, and cloud infrastructure monitoring.',
        posted_at: '2026-11-18T08:00:00Z',
      },
      {
        id: 'opp_004',
        title: 'EV Battery & Diagnostics Technician Apprentice',
        employer_id: 'emp_004',
        employer_name: 'Tata Motors',
        type: 'apprenticeship',
        sector: 'Automotive',
        location: 'Dharwad, Karnataka',
        district: 'Dharwad',
        state: 'Karnataka',
        is_remote: 0,
        stipend_or_salary: '₹16,500 / month',
        experience_required: 'Fresher',
        eligibility: 'ITI / Diploma in Electrical, Electronics, or Automobile Engineering',
        required_skills_json: JSON.stringify(['EV Technology', 'Battery Technology', 'Electrical Wiring', 'PLC Programming']),
        description: 'Hands-on EV assembly, battery pack diagnostics, and workshop safety certification in Dharwad.',
        posted_at: '2026-11-17T10:00:00Z',
      },
      {
        id: 'opp_005',
        title: 'Solar PV Installation & Maintenance Trainee',
        employer_id: 'emp_005',
        employer_name: 'L&T Construction Skills Academy',
        type: 'training_program',
        sector: 'Energy',
        location: 'Jaipur, Rajasthan',
        district: 'Jaipur',
        state: 'Rajasthan',
        is_remote: 0,
        stipend_or_salary: 'Free Training + Placement Support',
        experience_required: 'No prior experience required',
        eligibility: '10th / 12th / ITI pass from underserved or rural districts',
        required_skills_json: JSON.stringify(['Solar Energy', 'Electrical Wiring', 'HVAC']),
        description: '8-week NSQF-aligned practical bootcamp on rooftop and utility-scale solar PV installation with assured employer interviews.',
        posted_at: '2026-11-15T12:00:00Z',
      },
      {
        id: 'opp_006',
        title: 'Junior Data Analyst — District Health & Education',
        employer_id: 'emp_006',
        employer_name: 'NSDC Analytics Partner',
        type: 'entry_level_job',
        sector: 'Information Technology',
        location: 'Bengaluru, Karnataka',
        district: 'Bengaluru Urban',
        state: 'Karnataka',
        is_remote: 1,
        stipend_or_salary: '₹3.8 LPA',
        experience_required: '0-2 years',
        eligibility: 'Demonstrated SQL and spreadsheet/BI project portfolio',
        required_skills_json: JSON.stringify(['SQL', 'Python', 'Power BI', 'Data Analytics', 'Excel']),
        description: 'Clean, analyze, and visualize district-level education and skilling outcome datasets.',
        posted_at: '2026-11-14T15:00:00Z',
      },
      {
        id: 'opp_007',
        title: 'AI-Assisted Web & Cloud Bridge Bootcamp',
        employer_id: 'org_inst_001',
        employer_name: 'Don Bosco Institute of Technology & Skill Centre',
        type: 'training_program',
        sector: 'Information Technology',
        location: 'Bengaluru, Karnataka',
        district: 'Bengaluru Urban',
        state: 'Karnataka',
        is_remote: 1,
        stipend_or_salary: 'Scholarship Supported',
        experience_required: 'Basic HTML/JS',
        eligibility: 'Vocational and undergraduate learners preparing for Full Stack roles',
        required_skills_json: JSON.stringify(['TypeScript', 'Node.js', 'REST APIs', 'SQL', 'Git']),
        description: 'Targeted 6-week bridge program addressing missing backend, TypeScript, and SQL competencies.',
        posted_at: '2026-11-12T09:00:00Z',
      },
    ];
    for (const o of curatedOpportunities) insertOpportunity.run(o);

    const curatedSkills = [
      { id: 'sk_01', name: 'Generative AI', category: 'technology', description: 'LLM integration, prompt engineering, and RAG pipelines.', demand_score: 96, growth_rate: 142, demand_level: 'emerging', sector: 'Information Technology' },
      { id: 'sk_02', name: 'TypeScript', category: 'technology', description: 'Type-safe JavaScript for scalable web applications.', demand_score: 89, growth_rate: 44, demand_level: 'high_demand', sector: 'Information Technology' },
      { id: 'sk_03', name: 'React', category: 'technology', description: 'Component-based frontend engineering.', demand_score: 88, growth_rate: 32, demand_level: 'high_demand', sector: 'Information Technology' },
      { id: 'sk_04', name: 'Node.js', category: 'technology', description: 'Server-side JavaScript runtime and API services.', demand_score: 84, growth_rate: 28, demand_level: 'high_demand', sector: 'Information Technology' },
      { id: 'sk_05', name: 'SQL', category: 'hard_skill', description: 'Relational querying, schema design, and analytics.', demand_score: 91, growth_rate: 24, demand_level: 'high_demand', sector: 'Information Technology' },
      { id: 'sk_06', name: 'Python', category: 'technology', description: 'Scripting, data science, automation, and backend APIs.', demand_score: 93, growth_rate: 38, demand_level: 'high_demand', sector: 'Information Technology' },
      { id: 'sk_07', name: 'REST APIs', category: 'hard_skill', description: 'Designing, consuming, and securing HTTP APIs.', demand_score: 86, growth_rate: 26, demand_level: 'high_demand', sector: 'Information Technology' },
      { id: 'sk_08', name: 'Cloud Computing', category: 'technology', description: 'Deploying and operating cloud services (AWS/Azure/GCP).', demand_score: 90, growth_rate: 48, demand_level: 'high_demand', sector: 'Information Technology' },
      { id: 'sk_09', name: 'Docker', category: 'tool', description: 'Containerization and reproducible deployments.', demand_score: 81, growth_rate: 35, demand_level: 'high_demand', sector: 'Information Technology' },
      { id: 'sk_10', name: 'Git', category: 'tool', description: 'Distributed version control and collaborative workflows.', demand_score: 85, growth_rate: 18, demand_level: 'stable', sector: 'Information Technology' },
      { id: 'sk_11', name: 'EV Technology', category: 'technology', description: 'Electric vehicle powertrain and battery diagnostics.', demand_score: 88, growth_rate: 112, demand_level: 'emerging', sector: 'Automotive' },
      { id: 'sk_12', name: 'Solar Energy', category: 'hard_skill', description: 'Solar PV design, installation, and maintenance.', demand_score: 83, growth_rate: 76, demand_level: 'emerging', sector: 'Energy' },
      { id: 'sk_13', name: 'Power BI', category: 'tool', description: 'Interactive business intelligence dashboards.', demand_score: 79, growth_rate: 30, demand_level: 'high_demand', sector: 'Information Technology' },
      { id: 'sk_14', name: 'Cybersecurity', category: 'hard_skill', description: 'Application security, network defense, and auditing.', demand_score: 87, growth_rate: 55, demand_level: 'high_demand', sector: 'Information Technology' },
      { id: 'sk_15', name: 'Data Entry', category: 'hard_skill', description: 'Manual spreadsheet and form entry.', demand_score: 24, growth_rate: -35, demand_level: 'declining', sector: 'Administration' },
    ];
    for (const sk of curatedSkills) insertCatalogSkill.run(sk);

    const curatedCourses = [
      {
        id: 'crs_01',
        institute_id: 'org_inst_001',
        institute_name: 'Don Bosco Institute of Technology & Skill Centre',
        name: 'Full Stack Web Development',
        description: 'End-to-end web engineering with React, Node.js, TypeScript, and SQL.',
        sector: 'Information Technology',
        duration: '16 weeks',
        health_score: 82,
        health_level: 'good',
        breakdown_json: JSON.stringify({ industryAlignment: 85, skillCoverage: 80, emergingSkillCoverage: 74, placementPerformance: 84, employerSatisfaction: 83, curriculumFreshness: 78 }),
        required_skills_json: JSON.stringify(['JavaScript', 'React', 'HTML/CSS', 'TypeScript', 'Node.js', 'SQL', 'REST APIs', 'Git']),
        enrolled_count: 140,
        completed_count: 124,
        placed_count: 104,
      },
      {
        id: 'crs_02',
        institute_id: 'org_inst_001',
        institute_name: 'Don Bosco Institute of Technology & Skill Centre',
        name: 'Applied Data Analytics & BI',
        description: 'SQL, Python data analysis, and Power BI reporting for district & enterprise analytics.',
        sector: 'Information Technology',
        duration: '12 weeks',
        health_score: 86,
        health_level: 'excellent',
        breakdown_json: JSON.stringify({ industryAlignment: 90, skillCoverage: 85, emergingSkillCoverage: 80, placementPerformance: 86, employerSatisfaction: 88, curriculumFreshness: 84 }),
        required_skills_json: JSON.stringify(['Python', 'SQL', 'Power BI', 'Data Analytics', 'Excel']),
        enrolled_count: 110,
        completed_count: 101,
        placed_count: 87,
      },
      {
        id: 'crs_03',
        institute_id: 'org_inst_002',
        institute_name: 'Government ITI Hubballi',
        name: 'EV & Battery Service Technician',
        description: 'Electric two/four-wheeler diagnostics, BMS safety, and charging hardware maintenance.',
        sector: 'Automotive',
        duration: '20 weeks',
        health_score: 75,
        health_level: 'good',
        breakdown_json: JSON.stringify({ industryAlignment: 82, skillCoverage: 74, emergingSkillCoverage: 85, placementPerformance: 72, employerSatisfaction: 79, curriculumFreshness: 68 }),
        required_skills_json: JSON.stringify(['EV Technology', 'Battery Technology', 'Electrical Wiring', 'PLC Programming']),
        enrolled_count: 90,
        completed_count: 81,
        placed_count: 61,
      },
      {
        id: 'crs_04',
        institute_id: 'org_inst_002',
        institute_name: 'Government ITI Hubballi',
        name: 'Basic Office & Data Entry',
        description: 'Legacy clerical typing and manual form processing.',
        sector: 'Administration',
        duration: '8 weeks',
        health_score: 38,
        health_level: 'critical',
        breakdown_json: JSON.stringify({ industryAlignment: 28, skillCoverage: 45, emergingSkillCoverage: 15, placementPerformance: 32, employerSatisfaction: 48, curriculumFreshness: 30 }),
        required_skills_json: JSON.stringify(['Data Entry', 'Excel']),
        enrolled_count: 95,
        completed_count: 80,
        placed_count: 26,
      },
    ];
    for (const c of curatedCourses) insertCourse.run(c);

    insertFeedback.run({
      id: 'fb_001',
      employer_id: 'usr_emp_001',
      employer_name: 'Tata Consultancy Services',
      course_id: 'crs_01',
      skill_name: 'TypeScript',
      feedback_type: 'skill_gap',
      rating: 4,
      comments: 'Graduates have strong HTML/React basics, but need stronger TypeScript and REST API error-handling practice before joining client teams.',
      created_at: '2026-11-16T10:00:00Z',
    });

    insertFeedback.run({
      id: 'fb_002',
      employer_id: 'emp_004',
      employer_name: 'Tata Motors',
      course_id: 'crs_03',
      skill_name: 'EV Technology',
      feedback_type: 'curriculum',
      rating: 4,
      comments: 'High demand for BMS diagnostic tooling hands-on hours in ITI labs.',
      created_at: '2026-11-14T15:30:00Z',
    });

    const kaizenSeed = [
      { id: 'kz_01', title: 'Add TypeScript & API Testing Module to Web Dev', phase: 'plan', category: 'Curriculum', status: 'In Review', evidence: 'Employer feedback (TCS) + 44% YoY growth in TypeScript job requirements', impact_metric: 'Target: +15% frontend placement readiness', created_at: '2026-11-18T10:00:00Z' },
      { id: 'kz_02', title: 'Deploy Practical Portfolio Rubrics for Trainers', phase: 'do', category: 'Assessment', status: 'Active', evidence: 'Assessor validation improves employer shortlisting trust', impact_metric: '42 learner projects validated this quarter', created_at: '2026-11-12T10:00:00Z' },
      { id: 'kz_03', title: 'Evaluate 90-Day Retention in EV Technician Cohort', phase: 'check', category: 'Outcomes', status: 'Measuring', evidence: 'Post-placement 90-day check-in across Dharwad & Pune cohorts', impact_metric: '79% 90-day retention observed', created_at: '2026-11-08T10:00:00Z' },
      { id: 'kz_04', title: 'Sunset Legacy Data Entry Track into Digital Operations', phase: 'act', category: 'Policy', status: 'Completed', evidence: 'Declining demand (-35%) and 32% placement rate in legacy track', impact_metric: '+19% placement lift after cohort transition', created_at: '2026-10-25T10:00:00Z' },
    ];
    for (const k of kaizenSeed) insertKaizen.run(k);
  });

  txn();
}

export function rowToUser(row: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organisation_id?: string | null;
  organisation_name?: string | null;
  location?: string | null;
  created_at: string;
}): User & { location?: string } {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    organisationId: row.organisation_id || undefined,
    organisationName: row.organisation_name || undefined,
    location: row.location || undefined,
    createdAt: row.created_at,
  };
}
