import { sql } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db } from '../database/1'

export async function runMigrations() {
  await migrate(db, {
    migrationsFolder: './migrations',
    migrationsTable: 'think_migrations'
  })
}

// Example migration
export const migration_20240320 = sql`
-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create concepts table
CREATE TABLE concepts (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  properties JSONB,
  relations JSONB[],
  embedding vector(1536)
);

-- Create knowledge table
CREATE TABLE knowledge (
  id UUID PRIMARY KEY,
  type TEXT NOT NULL,
  content JSONB,
  relations UUID[],
  metadata JSONB,
  embedding vector(1536)
);

-- Create patterns table
CREATE TABLE patterns (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  structure JSONB,
  examples UUID[],
  embedding vector(1536)
);

-- Create vector indexes
CREATE INDEX concepts_embedding_idx ON concepts 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX knowledge_embedding_idx ON knowledge 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX patterns_embedding_idx ON patterns 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
` 