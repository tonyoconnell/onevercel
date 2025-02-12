import { z } from 'zod'

// Core Think Types
export const ThinkTypes = {
  // Thought Patterns
  Pattern: z.object({
    id: z.string().uuid(),
    type: z.enum(['code', 'concept', 'workflow', 'relation']),
    structure: z.record(z.unknown()),
    confidence: z.number().min(0).max(1)
  }),

  // Knowledge Units
  Knowledge: z.object({
    id: z.string().uuid(),
    type: z.enum(['fact', 'rule', 'concept', 'procedure']),
    content: z.unknown(),
    relations: z.array(z.string().uuid()),
    metadata: z.object({
      confidence: z.number(),
      source: z.string(),
      timestamp: z.date()
    })
  }),

  // Reasoning Steps
  Reasoning: z.object({
    id: z.string().uuid(),
    type: z.enum(['deduction', 'induction', 'abduction']),
    premises: z.array(z.string().uuid()),
    conclusion: z.string().uuid(),
    confidence: z.number()
  }),

  // Learning Events
  Learning: z.object({
    id: z.string().uuid(),
    type: z.enum(['observation', 'feedback', 'experiment']),
    data: z.unknown(),
    outcome: z.unknown(),
    metadata: z.object({
      startTime: z.date(),
      endTime: z.date(),
      success: z.boolean()
    })
  })
}

// Export inferred types
export type Pattern = z.infer<typeof ThinkTypes.Pattern>
export type Knowledge = z.infer<typeof ThinkTypes.Knowledge>
export type Reasoning = z.infer<typeof ThinkTypes.Reasoning>
export type Learning = z.infer<typeof ThinkTypes.Learning> 