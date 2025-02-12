import { z } from 'zod'
import { atom } from 'nanostores'
import { pgTable, serial, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { sql } from 'drizzle-orm'

// Memory content types
export const MemoryContent = z.union([
  z.object({ type: z.literal('text'), value: z.string() }),
  z.object({ type: z.literal('code'), value: z.string(), language: z.string() }),
  z.object({ type: z.literal('image'), url: z.string().url() }),
  z.object({ type: z.literal('structured'), data: z.record(z.unknown()) })
])

// Enhanced Memory Schema
export const MemorySchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['thought', 'experience', 'knowledge', 'connection']),
  content: MemoryContent,
  metadata: z.object({
    timestamp: z.date(),
    source: z.string(),
    confidence: z.number().min(0).max(1),
    embedding: z.array(z.number()).optional(),
    tags: z.array(z.string()).default([]),
    context: z.record(z.unknown()).optional(),
  }),
  relations: z.array(z.string().uuid()).default([]),
  ttl: z.number().optional(),
})

export type Memory = z.infer<typeof MemorySchema>

// Drizzle Schema
export const memories = pgTable('memories', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  content: jsonb('content').notNull(),
  metadata: jsonb('metadata').notNull(),
  relations: text('relations').array(),
  embedding: sql<number[]>`vector(1536)`,
  created_at: timestamp('created_at').defaultNow(),
  expires_at: timestamp('expires_at'),
})

// Nano Store
export const memoryStore = atom<Map<string, Memory>>(new Map()) 