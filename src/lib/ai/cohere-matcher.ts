// ============================================
// SKILLSYNC — Cohere Semantic Skill Matching Engine
// Compares learner skills with job requirements using embeddings
// ============================================

import crypto from 'crypto';
import { getSecret, sanitizeErrorMessage } from '@/lib/security/secret-locker';

const embeddingCache = new Map<string, number[]>();

function hashText(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (!a.length || a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function lexicalSimilarity(a: string, b: string): number {
  const tokenize = (s: string) =>
    new Set(
      s
        .toLowerCase()
        .replace(/[^a-z0-9+#.\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 1)
    );
  const setA = tokenize(a);
  const setB = tokenize(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let overlap = 0;
  for (const tok of setA) {
    if (setB.has(tok)) overlap++;
  }
  return Math.round((overlap / Math.sqrt(setA.size * setB.size)) * 100);
}

export async function computeCohereSemanticMatches(
  learnerText: string,
  opportunityDocs: Array<{ id: string; text: string }>
): Promise<{ scores: Record<string, number>; engine: 'cohere' | 'lexical-fallback' }> {
  const apiKey = getSecret('COHERE_API_KEY');
  const fallbackScores: Record<string, number> = {};
  for (const doc of opportunityDocs) {
    fallbackScores[doc.id] = lexicalSimilarity(learnerText, doc.text);
  }

  if (!apiKey || !learnerText.trim() || opportunityDocs.length === 0) {
    return { scores: fallbackScores, engine: 'lexical-fallback' };
  }

  try {
    const allTexts = [learnerText.slice(0, 2000), ...opportunityDocs.map((d) => d.text.slice(0, 2000))];
    const hashes = allTexts.map(hashText);

    const missingIndices: number[] = [];
    const missingTexts: string[] = [];
    hashes.forEach((h, idx) => {
      if (!embeddingCache.has(h)) {
        missingIndices.push(idx);
        missingTexts.push(allTexts[idx]);
      }
    });

    if (missingTexts.length > 0) {
      const response = await fetch('https://api.cohere.com/v2/embed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'embed-english-v3.0',
          texts: missingTexts,
          input_type: 'search_document',
          embedding_types: ['float'],
        }),
      });

      if (!response.ok) {
        const errBody = await response.text().catch(() => '');
        throw new Error(`Cohere API ${response.status}: ${errBody.slice(0, 200)}`);
      }

      const data = (await response.json()) as {
        embeddings?: { float?: number[][] };
      };
      const vectors = data.embeddings?.float;
      if (!Array.isArray(vectors) || vectors.length !== missingTexts.length) {
        throw new Error('Unexpected embedding payload from Cohere');
      }

      missingIndices.forEach((origIdx, vIdx) => {
        embeddingCache.set(hashes[origIdx], vectors[vIdx]);
      });
    }

    const learnerVec = embeddingCache.get(hashes[0]) || [];
    const scores: Record<string, number> = {};

    opportunityDocs.forEach((doc, idx) => {
      const docVec = embeddingCache.get(hashes[idx + 1]) || [];
      const rawSim = cosineSimilarity(learnerVec, docVec);
      // Cohere v3 search_document cosine scores typically sit in ~0.15 - 0.75 range; rescale sensibly to 0-100
      const scaled = Math.max(0, Math.min(100, Math.round(((rawSim - 0.1) / 0.6) * 100)));
      scores[doc.id] = scaled;
    });

    return { scores, engine: 'cohere' };
  } catch (err) {
    console.warn('Cohere semantic matcher fallback:', sanitizeErrorMessage(err));
    return { scores: fallbackScores, engine: 'lexical-fallback' };
  }
}
