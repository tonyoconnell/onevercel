import { z } from 'zod'
import { drizzle } from 'drizzle-orm/node-postgres'
import { sql, eq } from 'drizzle-orm'
import { createClient } from '@supabase/supabase-js'
import { Pool } from 'pg'
import { BlockManager, Block, BlockQ, BlockRel, BlockSchema } from './blocks'
import { generateEmbedding } from '../utils/embeddings'

export class BlockManagerImpl implements BlockManager {
  private db
  private supabase
  private pool

  constructor() {
    // Initialize connections
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      throw new Error('Missing DATABASE_URL')
    }

    this.pool = new Pool({ connectionString: dbUrl })
    this.db = drizzle(this.pool)
    
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials')
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  // Core operations
  async create(block: Omit<Block, 'id'>): Promise<Block> {
    const id = crypto.randomUUID()
    const newBlock = BlockSchema.parse({
      ...block,
      id,
      metadata: {
        ...block.metadata,
        created: new Date(),
        updated: new Date()
      }
    })

    // Generate embedding if it's text content
    if (newBlock.content.type === 'text') {
      newBlock.embedding = await this.generateEmbedding(newBlock.content.content)
    }

    // Store in database
    await this.db.execute(sql`
      INSERT INTO blocks ${sql.json(newBlock)}
    `)

    return newBlock
  }

  async update(id: string, data: Partial<Block>): Promise<Block> {
    const existing = await this.getById(id)
    if (!existing) throw new Error('Block not found')

    const updated = BlockSchema.parse({
      ...existing,
      ...data,
      metadata: {
        ...existing.metadata,
        ...data.metadata,
        updated: new Date()
      }
    })

    // Update embedding if content changed
    if (data.content?.type === 'text') {
      updated.embedding = await this.generateEmbedding(data.content.content)
    }

    await this.db.execute(sql`
      UPDATE blocks 
      SET ${sql.json(updated)}
      WHERE id = ${id}
    `)

    return updated
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.execute(sql`
      DELETE FROM blocks WHERE id = ${id}
    `)
    return result.rowCount > 0
  }

  // Query operations
  async getById(id: string): Promise<Block> {
    const result = await this.db.execute(sql`
      SELECT * FROM blocks WHERE id = ${id}
    `)
    if (!result.length) throw new Error('Block not found')
    return BlockSchema.parse(result[0])
  }

  async query(query: BlockQ): Promise<Block[]> {
    let queryBuilder = sql`SELECT * FROM blocks WHERE 1=1`

    // Build query based on type
    switch (query.type) {
      case 'content':
        queryBuilder = sql`${queryBuilder} AND content->>'type' = ${query.params.type}`
        break
      case 'semantic':
        if (query.params.embedding) {
          queryBuilder = sql`
            ${queryBuilder} 
            ORDER BY embedding <-> ${query.params.embedding}::vector
          `
        }
        break
      case 'relation':
        queryBuilder = sql`
          ${queryBuilder} 
          AND relations @> ${sql.json(query.params.relation)}
        `
        break
    }

    // Add sorting
    if (query.options?.sort) {
      queryBuilder = sql`
        ${queryBuilder} 
        ORDER BY ${sql.identifier(query.options.sort.field)} ${
          query.options.sort.order === 'desc' ? sql`DESC` : sql`ASC`
        }
      `
    }

    // Add pagination
    if (query.options?.limit) {
      queryBuilder = sql`${queryBuilder} LIMIT ${query.options.limit}`
    }
    if (query.options?.offset) {
      queryBuilder = sql`${queryBuilder} OFFSET ${query.options.offset}`
    }

    const result = await this.db.execute(queryBuilder)
    return z.array(BlockSchema).parse(result)
  }

  async search(text: string, limit = 5): Promise<Block[]> {
    const embedding = await this.generateEmbedding(text)
    return this.query({
      type: 'semantic',
      params: { embedding },
      options: { limit }
    })
  }

  // Relationship operations
  async link(sourceId: string, targetId: string, type: BlockRel['type']): Promise<boolean> {
    const source = await this.getById(sourceId)
    const relation: BlockRel = {
      type,
      targetId,
      metadata: { order: source.relations.length }
    }
    
    source.relations.push(relation)
    await this.update(sourceId, { relations: source.relations })
    return true
  }

  async unlink(sourceId: string, targetId: string): Promise<boolean> {
    const source = await this.getById(sourceId)
    source.relations = source.relations.filter(rel => rel.targetId !== targetId)
    await this.update(sourceId, { relations: source.relations })
    return true
  }

  async getRelated(id: string, type?: BlockRel['type']): Promise<Block[]> {
    const block = await this.getById(id)
    const relationIds = block.relations
      .filter(rel => !type || rel.type === type)
      .map(rel => rel.targetId)
    
    if (!relationIds.length) return []

    const result = await this.db.execute(sql`
      SELECT * FROM blocks 
      WHERE id = ANY(${relationIds}::uuid[])
    `)
    return z.array(BlockSchema).parse(result)
  }

  // Utility operations
  async validate(block: unknown): Promise<boolean> {
    try {
      BlockSchema.parse(block)
      return true
    } catch {
      return false
    }
  }

  async generateEmbedding(content: string): Promise<number[]> {
    return generateEmbedding(content)
  }

  async cleanup(): Promise<void> {
    // Delete expired blocks
    await this.db.execute(sql`
      DELETE FROM blocks 
      WHERE ttl IS NOT NULL 
      AND created_at + (ttl || ' seconds')::interval < NOW()
    `)
  }
} 