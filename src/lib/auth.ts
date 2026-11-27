import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { getDb, rowToUser } from '@/lib/db';
import { getSecret } from '@/lib/security/secret-locker';
import type { User, UserRole } from '@/types';

function getJwtSecretBytes(): Uint8Array {
  const secret = getSecret('JWT_SECRET') || 'skillsync-dev-fallback-secret';
  return new TextEncoder().encode(secret);
}
const COOKIE_NAME = 'skillsync-token';

const ALLOWED_SELF_REGISTER_ROLES: UserRole[] = ['student', 'trainer', 'institute', 'employer'];

// Demo user directory kept for login quick-select & compatibility
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
      createdAt: '2025-01-15T10:00:00Z',
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
      organisationName: 'Don Bosco Institute of Technology & Skill Centre',
      createdAt: '2025-02-01T10:00:00Z',
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
      organisationName: 'Don Bosco Institute of Technology & Skill Centre',
      createdAt: '2025-02-15T10:00:00Z',
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
      createdAt: '2025-03-01T10:00:00Z',
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
      organisationName: 'Government Polytechnic & Skill Hub, Hubballi',
      createdAt: '2025-04-01T10:00:00Z',
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
      createdAt: '2025-04-15T10:00:00Z',
    },
  },
};

async function signUserToken(user: User): Promise<string> {
  return new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .setIssuedAt()
    .sign(getJwtSecretBytes());
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: User; token: string } | null> {
  if (!email || !password) return null;
  const normalizedEmail = email.trim().toLowerCase();
  const db = getDb();

  const row = db
    .prepare('SELECT id, name, email, password_hash, role, organisation_id, organisation_name, location, created_at FROM users WHERE email = ?')
    .get(normalizedEmail) as
    | {
        id: string;
        name: string;
        email: string;
        password_hash: string;
        role: UserRole;
        organisation_id: string | null;
        organisation_name: string | null;
        location: string | null;
        created_at: string;
      }
    | undefined;

  if (!row) return null;

  const valid = await bcrypt.compare(password, row.password_hash);
  if (!valid) return null;

  const user = rowToUser(row);
  const token = await signUserToken(user);
  return { user, token };
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organisationName?: string;
  location?: string;
}): Promise<{ user: User; token: string }> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const safeRole: UserRole = ALLOWED_SELF_REGISTER_ROLES.includes(input.role) ? input.role : 'student';
  const db = getDb();

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (existing) {
    throw new Error('EMAIL_EXISTS');
  }

  const userId = `usr_${safeRole.slice(0, 3)}_${Date.now().toString(36)}`;
  const passwordHash = await bcrypt.hash(input.password, 10);
  const createdAt = new Date().toISOString();
  const orgId = input.organisationName ? `org_${Date.now().toString(36)}` : null;

  const txn = db.transaction(() => {
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, organisation_id, organisation_name, location, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      input.name.trim(),
      normalizedEmail,
      passwordHash,
      safeRole,
      orgId,
      input.organisationName?.trim() || null,
      input.location?.trim() || null,
      createdAt
    );

    if (safeRole === 'student') {
      db.prepare(`
        INSERT INTO learner_profiles (user_id, headline, location, updated_at)
        VALUES (?, ?, ?, ?)
      `).run(
        userId,
        'SkillSync Learner',
        input.location?.trim() || '',
        createdAt
      );
    }
  });

  txn();

  const user: User = {
    id: userId,
    name: input.name.trim(),
    email: normalizedEmail,
    role: safeRole,
    organisationId: orgId || undefined,
    organisationName: input.organisationName?.trim() || undefined,
    createdAt,
  };
  const token = await signUserToken(user);
  return { user, token };
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretBytes());
    const userId = payload.userId as string | undefined;
    const email = payload.email as string | undefined;
    if (!userId && !email) return null;

    const db = getDb();
    const row = userId
      ? db
          .prepare('SELECT id, name, email, role, organisation_id, organisation_name, location, created_at FROM users WHERE id = ?')
          .get(userId)
      : db
          .prepare('SELECT id, name, email, role, organisation_id, organisation_name, location, created_at FROM users WHERE email = ?')
          .get(email);

    if (!row) return null;
    return rowToUser(row as Parameters<typeof rowToUser>[0]);
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
