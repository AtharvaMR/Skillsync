// ============================================
// SKILLSYNC — AI Provider Abstraction Layer
// ============================================

import { getSecret, sanitizeErrorMessage } from '@/lib/security/secret-locker';

export interface AIProvider {
  name: string;
  generateText(prompt: string, systemPrompt?: string): Promise<string>;
  generateJSON<T>(prompt: string, systemPrompt?: string): Promise<T>;
}

export interface AIConfig {
  provider: 'gemini' | 'openai' | 'claude';
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export function createAIProvider(config: AIConfig): AIProvider {
  switch (config.provider) {
    case 'gemini':
      return new GeminiProvider(config);
    case 'openai':
      return new PlaceholderProvider('OpenAI');
    case 'claude':
      return new PlaceholderProvider('Claude');
    default:
      throw new Error(`Unknown AI provider: ${config.provider}`);
  }
}

export function getDefaultProvider(): AIProvider {
  const apiKey = getSecret('GEMINI_API_KEY');
  if (!apiKey) {
    return new MockAIProvider();
  }

  return createAIProvider({
    provider: 'gemini',
    apiKey,
    model: 'gemini-3-flash-preview',
    temperature: 0.3,
  });
}

class GeminiProvider implements AIProvider {
  name = 'Google Gemini';
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    const candidateModels = [
      this.config.model || 'gemini-3-flash-preview',
      'gemini-flash-latest',
    ];
    let lastErr: unknown;

    for (const modelName of candidateModels) {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(this.config.apiKey);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: this.config.temperature ?? 0.3,
            maxOutputTokens: this.config.maxTokens ?? 4096,
          },
        });

        const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
        const result = await model.generateContent(fullPrompt);
        return result.response.text();
      } catch (err) {
        lastErr = err;
      }
    }
    throw new Error(sanitizeErrorMessage(lastErr));
  }

  async generateJSON<T>(prompt: string, systemPrompt?: string): Promise<T> {
    const jsonPrompt = `${prompt}\n\nRespond ONLY with valid JSON. No markdown, no explanation, no code blocks.`;
    const text = await this.generateText(jsonPrompt, systemPrompt);

    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
    if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
    if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
    cleaned = cleaned.trim();

    return JSON.parse(cleaned) as T;
  }
}

class PlaceholderProvider implements AIProvider {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  async generateText(): Promise<string> {
    throw new Error(`${this.name} provider is not configured.`);
  }

  async generateJSON<T>(): Promise<T> {
    throw new Error(`${this.name} provider is not configured.`);
  }
}

class MockAIProvider implements AIProvider {
  name = 'Mock AI (No API Key)';

  async generateText(prompt: string): Promise<string> {
    if (prompt.includes('extract skills')) {
      return JSON.stringify(['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Docker']);
    }
    return 'AI analysis is unavailable. Configure GEMINI_API_KEY in .env.local';
  }

  async generateJSON<T>(): Promise<T> {
    return [] as unknown as T;
  }
}
