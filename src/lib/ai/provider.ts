// ============================================
// SKILLSYNC — AI Provider Abstraction Layer
// ============================================

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

// Factory function to create AI provider
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

// Get the default AI provider using environment configuration
export function getDefaultProvider(): AIProvider {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not set, using mock AI provider');
    return new MockAIProvider();
  }

  return createAIProvider({
    provider: 'gemini',
    apiKey,
    model: 'gemini-2.0-flash',
    temperature: 0.3,
  });
}

// ---- Gemini Provider ----
class GeminiProvider implements AIProvider {
  name = 'Google Gemini';
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(this.config.apiKey);
    const model = genAI.getGenerativeModel({
      model: this.config.model || 'gemini-2.0-flash',
      generationConfig: {
        temperature: this.config.temperature || 0.3,
        maxOutputTokens: this.config.maxTokens || 4096,
      },
    });

    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  }

  async generateJSON<T>(prompt: string, systemPrompt?: string): Promise<T> {
    const jsonPrompt = `${prompt}\n\nRespond ONLY with valid JSON. No markdown, no explanation, no code blocks.`;
    const text = await this.generateText(jsonPrompt, systemPrompt);

    // Clean the response - remove markdown code blocks if present
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
    if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
    if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
    cleaned = cleaned.trim();

    return JSON.parse(cleaned) as T;
  }
}

// ---- Placeholder for future providers ----
class PlaceholderProvider implements AIProvider {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  async generateText(): Promise<string> {
    throw new Error(`${this.name} provider is not yet implemented. Please use Gemini.`);
  }

  async generateJSON<T>(): Promise<T> {
    throw new Error(`${this.name} provider is not yet implemented. Please use Gemini.`);
  }
}

// ---- Mock provider for when no API key is available ----
class MockAIProvider implements AIProvider {
  name = 'Mock AI (No API Key)';

  async generateText(prompt: string): Promise<string> {
    if (prompt.includes('extract skills')) {
      return JSON.stringify(['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Docker', 'AWS']);
    }
    return 'AI analysis is unavailable. Please configure GEMINI_API_KEY in .env.local';
  }

  async generateJSON<T>(): Promise<T> {
    return [] as unknown as T;
  }
}
