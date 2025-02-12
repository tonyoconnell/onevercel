import { z } from 'zod'
import { ThinkTypes } from '../types/types'

// Base Block Content Types
export const BlockContent = {
  // Text-based content
  Text: z.object({
    type: z.literal('text'),
    content: z.string(),
    format: z.enum(['plain', 'markdown', 'html', 'latex']),
    metadata: z.object({
      language: z.string().optional(),
      readingTime: z.number().optional(),
      wordCount: z.number().optional()
    }).optional()
  }),

  // Code content
  Code: z.object({
    type: z.literal('code'),
    content: z.string(),
    language: z.string(),
    metadata: z.object({
      lineCount: z.number().optional(),
      dependencies: z.array(z.string()).optional(),
      version: z.string().optional()
    }).optional()
  }),

  // Data content
  Data: z.object({
    type: z.literal('data'),
    content: z.record(z.unknown()),
    schema: z.string(), // Reference to schema definition
    metadata: z.object({
      version: z.string().optional(),
      lastValidated: z.date().optional(),
      source: z.string().optional()
    }).optional()
  }),

  // Media content
  Media: z.object({
    type: z.literal('media'),
    content: z.object({
      url: z.string().url(),
      mimeType: z.string(),
      alt: z.string().optional()
    }),
    metadata: z.object({
      size: z.number().optional(),
      dimensions: z.object({
        width: z.number(),
        height: z.number()
      }).optional(),
      duration: z.number().optional() // For audio/video
    }).optional()
  })
}

// Block Relationships
export const BlockRelation = z.object({
  type: z.enum(['parent', 'child', 'reference', 'dependency', 'extension']),
  targetId: z.string().uuid(),
  metadata: z.object({
    order: z.number().optional(),
    strength: z.number().min(0).max(1).optional(),
    context: z.record(z.unknown()).optional()
  }).optional()
})

// Block Schema
export const BlockSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['content', 'container', 'reference', 'system']),
  content: z.discriminatedUnion('type', [
    BlockContent.Text,
    BlockContent.Code,
    BlockContent.Data,
    BlockContent.Media
  ]),
  metadata: z.object({
    created: z.date(),
    updated: z.date(),
    author: z.string().uuid(),
    version: z.string(),
    tags: z.array(z.string()).default([]),
    status: z.enum(['draft', 'review', 'published', 'archived']).default('draft'),
    permissions: z.object({
      read: z.array(z.string().uuid()),
      write: z.array(z.string().uuid()),
      execute: z.array(z.string().uuid())
    }).optional()
  }),
  relations: z.array(BlockRelation).default([]),
  embedding: z.array(z.number()).optional(), // Vector embedding for semantic search
  ttl: z.number().optional() // Time to live in seconds
})

// Block Operations
export const BlockOperation = z.object({
  type: z.enum(['create', 'update', 'delete', 'link', 'unlink', 'move']),
  blockId: z.string().uuid(),
  data: z.record(z.unknown()),
  metadata: z.object({
    timestamp: z.date(),
    userId: z.string().uuid(),
    reason: z.string().optional()
  })
})

// Block Query
export const BlockQuery = z.object({
  type: z.enum(['id', 'content', 'semantic', 'relation']),
  params: z.record(z.unknown()),
  options: z.object({
    limit: z.number().optional(),
    offset: z.number().optional(),
    sort: z.object({
      field: z.string(),
      order: z.enum(['asc', 'desc'])
    }).optional()
  }).optional()
})

// Export types
export type Block = z.infer<typeof BlockSchema>
export type BlockOp = z.infer<typeof BlockOperation>
export type BlockRel = z.infer<typeof BlockRelation>
export type BlockQ = z.infer<typeof BlockQuery>

// Block Manager Interface
export interface BlockManager {
  // Core operations
  create(block: Omit<Block, 'id'>): Promise<Block>
  update(id: string, data: Partial<Block>): Promise<Block>
  delete(id: string): Promise<boolean>
  
  // Query operations
  getById(id: string): Promise<Block>
  query(query: BlockQ): Promise<Block[]>
  search(text: string, limit?: number): Promise<Block[]>
  
  // Relationship operations
  link(sourceId: string, targetId: string, type: BlockRel['type']): Promise<boolean>
  unlink(sourceId: string, targetId: string): Promise<boolean>
  getRelated(id: string, type?: BlockRel['type']): Promise<Block[]>
  
  // Utility operations
  validate(block: unknown): Promise<boolean>
  generateEmbedding(content: string): Promise<number[]>
  cleanup(): Promise<void>
} 