import { z } from 'zod';

const ContentPart = z.object({
  type: z.literal('text'),
  text: z.string()
});

// Define supported providers
const ProviderSchema = z.enum(['openai', 'anthropic', 'mistral', 'ollama']).default('mistral');

export const ChatConfigSchema = z.object({
  provider: ProviderSchema,
  model: z.string().default('mistral-large-latest'),
  apiKey: z.string().optional(),
  apiEndpoint: z.string().url().optional(),
  runtime: z.enum(['edge', 'node']).default('edge'),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(1).max(4000).default(2000),
  systemPrompt: z.array(ContentPart).default([{
    type: 'text',
    text: 'I am Agent ONE. How can I help you today?'
  }]),
  userPrompt: z.array(ContentPart).optional(),
  welcome: z.object({
    message: z.string().default('How can I help you today?'),
    avatar: z.string().default('/icon.svg'),
    suggestions: z.array(z.object({
      label: z.string(),
      prompt: z.string()
    })).default([])
  }).default({
    message: 'How can I help you today?',
    avatar: '/icon.svg',
    suggestions: []
  })
});

export type ChatConfig = z.infer<typeof ChatConfigSchema>;

// Helper function to create a default config
export function createDefaultConfig(overrides?: Partial<z.infer<typeof ChatConfigSchema>>): ChatConfig {
  return ChatConfigSchema.parse(overrides || {});
}