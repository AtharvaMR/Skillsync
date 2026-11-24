import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { User, UserRole } from '@/types';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'skillsync-default-secret');
const COOKIE_NAME = 'skillsync-token';

// Demo users for each role
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@skillsync.gov.in': {
    password: 'SkillSync2024!',
    user: {
      id: 'usr_gov_001',
      name: 'Dr. Rajesh Kumar',
      email: 'admin@skillsync.gov.in',
      role: 'government',
      organisationId: 'org_gov_001',
      organisationName: 'Ministry of Skill Development & Entrepreneurship',
      createdAt: '2024-01-15T10:00:00Z',
    },
  },
  'institute@skillsync.gov.in': {
    password: 'SkillSync2024!',
    user: {
      id: 'usr_inst_001',
      name: 'Prof. Anita Sharma',
      email: 'institute@skillsync.gov.in',
      role: 'institute',
      organisationId: 'org_inst_001',
      organisationName: 'National Institute of Technology, Bengaluru',
      createdAt: '2024-02-01T10:00:00Z',
    },
  },
  'trainer@skillsync.gov.in': {
    password: 'SkillSync2024!',
    user: {
      id: 'usr_trn_001',
      name: 'Vikram Mehta',
      email: 'trainer@skillsync.gov.in',
      role: 'trainer',
      organisationId: 'org_inst_001',
      organisationName: 'National Institute of Technology, Bengaluru',
      createdAt: '2024-02-15T10:00:00Z',
    },
  },
  'employer@skillsync.gov.in': {
    password: 'SkillSync2024!',
    user: {
      id: 'usr_emp_001',
      name: 'Priya Nair',
      email: 'employer@skillsync.gov.in',
      role: 'employer',
      organisationId: 'org_emp_001',
      organisationName: 'Tata Consultancy Services',
      createdAt: '2024-03-01T10:00:00Z',
    },
  },
  'student@skillsync.gov.in': {
    password: 'SkillSync2024!',
    user: {
      id: 'usr_stu_001',
      name: 'Arjun Patel',
      email: 'student@skillsync.gov.in',
      role: 'student',
      organisationId: 'org_inst_001',
      organisationName: 'National Institute of Technology, Bengaluru',
      createdAt: '2024-04-01T10:00:00Z',
    },
  },
  'analyst@skillsync.gov.in': {
    password: 'SkillSync2024!',
    user: {
      id: 'usr_ana_001',
      name: 'Meera Iyer',
      email: 'analyst@skillsync.gov.in',
      role: 'analyst',
      organisationId: 'org_gov_001',
      organisationName: 'Ministry of Skill Development & Entrepreneurship',
      createdAt: '2024-04-15T10:00:00Z',
    },
  },
};

export async function authenticateUser(email: string, password: string): Promise<{ user: User; token: string } | null> {
  const entry = DEMO_USERS[email.toLowerCase()];
  if (!entry || entry.password !== password) {
    return null;
  }

  const token = await new SignJWT({
    userId: entry.user.id,
    email: entry.user.email,
    role: entry.user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .setIssuedAt()
    .sign(JWT_SECRET);

  return { user: entry.user, token };
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const email = payload.email as string;
    const entry = DEMO_USERS[email];
    return entry?.user || null;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function getDemoUsers(): Array<{ email: string; role: UserRole; name: string }> {
  return Object.entries(DEMO_USERS).map(([email, entry]) => ({
    email,
    role: entry.user.role,
    name: entry.user.name,
  }));
}

export { COOKIE_NAME, DEMO_USERS };
