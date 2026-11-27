// ============================================
// SKILLSYNC — Server-Only Secret Locker
// Keeps API keys and signing secrets isolated on the server,
// masks values in diagnostics, and scrubs keys from error messages.
// ============================================

import crypto from 'crypto';

export type ManagedSecretName =
  | 'GEMINI_API_KEY'
  | 'GROQ_API_KEY'
  | 'COHERE_API_KEY'
  | 'JWT_SECRET';

function assertServerOnly() {
  if (typeof window !== 'undefined') {
    throw new Error('SECURITY VIOLATION: Secret Locker cannot be accessed in browser context.');
  }
}

function getRawSecrets(): Record<ManagedSecretName, string> {
  assertServerOnly();
  return {
    GEMINI_API_KEY: (process.env.GEMINI_API_KEY || '').trim(),
    GROQ_API_KEY: (process.env.GROQ_API_KEY || '').trim(),
    COHERE_API_KEY: (process.env.COHERE_API_KEY || '').trim(),
    JWT_SECRET: (process.env.JWT_SECRET || '').trim(),
  };
}

/**
 * Retrieve a server-side secret from the locker. Never returns to client code.
 */
export function getSecret(name: ManagedSecretName): string {
  assertServerOnly();
  const secrets = getRawSecrets();
  return secrets[name] || '';
}

/**
 * Require a secret or throw a clean sanitized error.
 */
export function requireSecret(name: ManagedSecretName): string {
  const val = getSecret(name);
  if (!val) {
    throw new Error(`${name} is not configured in the server environment.`);
  }
  return val;
}

/**
 * Mask a secret for safe server-side inspection (e.g. "AQ.A***LSwQ").
 */
export function maskSecret(value: string): string {
  if (!value) return 'not-configured';
  if (value.length <= 8) return '****';
  return `${value.slice(0, 4)}***${value.slice(-4)}`;
}

/**
 * Scrub any known secret value from an error string or log line before surfacing.
 */
export function sanitizeErrorMessage(err: unknown): string {
  assertServerOnly();
  let msg = err instanceof Error ? err.message : String(err || 'Unknown server error');
  const secrets = getRawSecrets();

  for (const val of Object.values(secrets)) {
    if (val && val.length >= 6 && msg.includes(val)) {
      msg = msg.split(val).join('[REDACTED]');
    }
  }

  // Also redact common key prefixes if partially echoed by upstream APIs
  msg = msg.replace(/\b(AQ\.[A-Za-z0-9_\-]+|gsk_[A-Za-z0-9_\-]+|AIza[A-Za-z0-9_\-]+)\b/g, '[REDACTED_KEY]');
  return msg;
}

/**
 * Return a safe integration health summary (booleans + fingerprint hash only, zero raw secrets).
 */
export function getLockerStatus() {
  assertServerOnly();
  const secrets = getRawSecrets();
  const fingerprint = (val: string) =>
    val ? crypto.createHash('sha256').update(val).digest('hex').slice(0, 8) : null;

  return {
    gemini: {
      engine: 'AI Skill Intelligence Engine',
      configured: Boolean(secrets.GEMINI_API_KEY),
      fingerprint: fingerprint(secrets.GEMINI_API_KEY),
    },
    groq: {
      engine: 'AI Career Assistant Chatbot',
      configured: Boolean(secrets.GROQ_API_KEY),
      fingerprint: fingerprint(secrets.GROQ_API_KEY),
    },
    cohere: {
      engine: 'Semantic Skill Matching Engine',
      configured: Boolean(secrets.COHERE_API_KEY),
      fingerprint: fingerprint(secrets.COHERE_API_KEY),
    },
    jwt: {
      engine: 'Session Signing Locker',
      configured: Boolean(secrets.JWT_SECRET),
      fingerprint: fingerprint(secrets.JWT_SECRET),
    },
  };
}
