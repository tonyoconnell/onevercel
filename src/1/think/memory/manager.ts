import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/node-postgres'
import { eq, sql } from 'drizzle-orm'
import { memories, type Memory } from './memory'
import { memoryStore } from './memory'
import { Pool } from 'pg'

export class MemoryManager {
  private supabase: SupabaseClient
  private db: PostgresJsDatabase
  private pool: Pool

  constructor() {
    // Initialize Supabase with proper error handling
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials')
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)

    // Initialize Postgres with proper error handling
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      throw new Error('Missing database URL')
    }

    this.pool = new Pool({ connectionString: dbUrl })
    this.db = drizzle(this.pool)
  }

  async store(memory: Memory) {
    try {
      // Store in local memory
      memoryStore.set(new Map(memoryStore.get()).set(memory.id, memory))

      // Store in database
      await this.db.insert(memories).values({
        ...memory,
        expires_at: memory.ttl 
          ? new Date(Date.now() + memory.ttl * 1000)
          : null
      })

      return true
    } catch (error) {
      console.error('Failed to store memory:', error)
      return false
    }
  }

  async recall(query: string, limit = 5): Promise<Memory[]> {
    try {
      // Generate embedding for query
      const { data: embedding } = await this.supabase.functions.invoke('embed', {
        body: { text: query }
      })

      // Search by vector similarity
      const results = await this.db.execute(sql`
        SELECT *, 
          embedding <-> ${embedding}::vector as distance
        FROM memories
        WHERE expires_at IS NULL OR expires_at > NOW()
        ORDER BY distance
        LIMIT ${limit}
      `)

      return results as Memory[]
    } catch (error) {
      console.error('Failed to recall memories:', error)
      return []
    }
  }

  async connect(memoryId: string, relatedId: string) {
    try {
      const memory = await this.db
        .select()
        .from(memories)
        .where(eq(memories.id, memoryId))
        .limit(1)

      if (!memory.length) return false

      const relations = [...memory[0].relations, relatedId]
      
      await this.db
        .update(memories)
        .set({ relations })
        .where(eq(memories.id, memoryId))

      return true
    } catch (error) {
      console.error('Failed to connect memories:', error)
      return false
    }
  }

  async forget(memoryId: string) {
    try {
      // Remove from local store
      const store = new Map(memoryStore.get())
      store.delete(memoryId)
      memoryStore.set(store)

      // Remove from database
      await this.db
        .delete(memories)
        .where(eq(memories.id, memoryId))

      return true
    } catch (error) {
      console.error('Failed to forget memory:', error)
      return false
    }
  }
} 