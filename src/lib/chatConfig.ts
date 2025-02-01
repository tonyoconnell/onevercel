import { z } from 'zod';

const ContentPart = z.object({
  type: z.literal('text'),
  text: z.string()
});

export const ChatConfigSchema = z.object({
  model: z.string().default('gpt-4o-mini'),
  apiEndpoint: z.string().url().default('https://api.openai.com/v1'),
  runtime: z.enum(['edge', 'node']).default('edge'),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(1).max(4000).default(2000),
  systemPrompt: z.array(ContentPart).default([{
    type: 'text',
    text: 'You are a helpful assistant.'
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