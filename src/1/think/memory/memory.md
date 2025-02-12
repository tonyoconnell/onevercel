# Memory System Documentation

The memory system is a core component of ONE's think system, providing persistent and ephemeral storage with semantic search capabilities.

## Architecture

```
/1/think/memory/           # Memory subsystem root
├── 1.ts                   # Core types & schemas
├── manager.ts             # Memory management
├── hooks.ts              # React hooks
├── memory.md             # This documentation
│
└── store/                # Storage implementations
    ├── 1.ts             # Store interface
    ├── nano.ts          # Nanostore (local)
    ├── supabase.ts      # Supabase (vector)
    └── pg.ts            # PostgreSQL (persistent)
```

## Core Components

### 1. Memory Types

```typescript
// Core memory content types
const MemoryContent = z.union([
  z.object({ type: z.literal('text'), value: z.string() }),
  z.object({ type: z.literal('code'), value: z.string(), language: z.string() }),
  z.object({ type: z.literal('image'), url: z.string().url() }),
  z.object({ type: z.literal('structured'), data: z.record(z.unknown()) })
])

// Memory schema
const MemorySchema = z.object({
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
```

### 2. Storage Layer

The memory system uses a multi-tiered storage approach:

1. **Local Storage (Nanostore)**
   - Fast access for active memories
   - In-memory caching
   - Reactive state updates

2. **Vector Storage (Supabase)**
   - Semantic search capabilities
   - Embedding storage
   - Similarity queries

3. **Persistent Storage (PostgreSQL)**
   - Long-term memory storage
   - Relationship management
   - Complex queries

## Core Operations

### 1. Memory Storage

```typescript
// Store new memory
async function store(memory: Memory): Promise<boolean> {
  try {
    // Generate embedding if needed
    if (typeof memory.content === 'string') {
      memory.metadata.embedding = await generateEmbedding(memory.content)
    }

    // Store in all layers
    await Promise.all([
      localStore.set(memory.id, memory),
      vectorStore.store(memory),
      persistentStore.save(memory)
    ])

    return true
  } catch (error) {
    console.error('Failed to store memory:', error)
    return false
  }
}
```

### 2. Memory Recall

```typescript
// Recall similar memories
async function recall(query: string, options?: RecallOptions): Promise<Memory[]> {
  try {
    // Generate query embedding
    const embedding = await generateEmbedding(query)

    // Search vector store
    const results = await vectorStore.search(embedding, options?.limit || 5)

    // Enrich results with relationships
    return await enrichMemories(results)
  } catch (error) {
    console.error('Failed to recall memories:', error)
    return []
  }
}
```

### 3. Memory Management

```typescript
// Connect related memories
async function connect(sourceId: string, targetId: string): Promise<boolean> {
  try {
    const [source, target] = await Promise.all([
      persistentStore.get(sourceId),
      persistentStore.get(targetId)
    ])

    if (!source || !target) return false

    // Update relationships
    source.relations.push(targetId)
    target.relations.push(sourceId)

    // Save updates
    await Promise.all([
      persistentStore.save(source),
      persistentStore.save(target)
    ])

    return true
  } catch (error) {
    console.error('Failed to connect memories:', error)
    return false
  }
}
```

## React Integration

The memory system provides React hooks for easy integration:

```typescript
function MemoryComponent() {
  const { memories, operations, store, recall } = useMemory()

  // Store new memory
  const saveMemory = async () => {
    await store({
      type: 'knowledge',
      content: {
        type: 'text',
        value: 'Important information'
      },
      metadata: {
        timestamp: new Date(),
        source: 'user',
        confidence: 1.0,
        tags: ['important']
      }
    })
  }

  // Loading states
  if (operations.store?.loading) {
    return <div>Storing memory...</div>
  }

  return (
    <div>
      <button onClick={saveMemory}>Store Memory</button>
      {operations.store?.error && (
        <div className="error">
          Failed to store memory: {operations.store.error.message}
        </div>
      )}
    </div>
  )
}
```

## Database Schema

```sql
-- Memory table
CREATE TABLE memories (
  id UUID PRIMARY KEY,
  type TEXT NOT NULL,
  content JSONB NOT NULL,
  metadata JSONB NOT NULL,
  relations TEXT[] DEFAULT '{}',
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX memories_type_idx ON memories(type);
CREATE INDEX memories_expires_at_idx ON memories(expires_at);
CREATE INDEX memories_embedding_idx ON memories 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

## Best Practices

1. **Memory Storage**
   - Use appropriate memory types
   - Include relevant metadata
   - Set TTL for temporary memories
   - Tag memories for better organization

2. **Memory Recall**
   - Use specific queries
   - Set appropriate limits
   - Handle missing results
   - Cache frequent queries

3. **Error Handling**
   - Implement proper error boundaries
   - Log failures appropriately
   - Provide fallback behaviors
   - Clean up on failures

4. **Performance**
   - Use connection pooling
   - Implement caching
   - Batch related operations
   - Monitor memory usage

## Memory Lifecycle

1. **Creation**
   - Validate memory structure
   - Generate embeddings
   - Store in all layers
   - Create relationships

2. **Access**
   - Check local cache
   - Query vector store
   - Fallback to persistent store
   - Enrich with relationships

3. **Updates**
   - Validate changes
   - Update all layers
   - Maintain consistency
   - Update relationships

4. **Deletion**
   - Remove from all layers
   - Clean up relationships
   - Handle cascading deletes
   - Update indexes

## Monitoring

1. **Metrics to Track**
   - Storage usage
   - Query performance
   - Cache hit rates
   - Error rates

2. **Health Checks**
   - Storage connectivity
   - Vector store health
   - Index performance
   - Memory cleanup

## Future Enhancements

1. **Planned Features**
   - Advanced pattern matching
   - Improved embedding models
   - Automated cleanup
   - Memory compression

2. **Research Areas**
   - Memory consolidation
   - Forgetting strategies
   - Context awareness
   - Memory optimization

Remember: The memory system is crucial for ONE's cognitive capabilities. Keep it optimized and well-maintained.