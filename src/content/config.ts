import { defineCollection, z } from 'astro:content';

// Define the Blog schema
const BlogSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  draft: z.boolean().optional(),
  picture: z.string().optional(),
  image: z.string().optional(),
  type: z.string().optional()
});

// Define the Docs schema
const DocsSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  draft: z.boolean().optional(),
  section: z.string().optional(),
  order: z.number().optional()
});

// Define the Blog collection
export const blog = defineCollection({
  type: 'content',
  schema: BlogSchema,
});

// Define the Docs collection
export const docs = defineCollection({
  type: 'content',
  schema: DocsSchema,
});

// Export all collections
export const collections = {
  'blog': blog,
  'docs': docs
};

// Export schema types
export type BlogSchema = z.infer<typeof BlogSchema>;
export type DocsSchema = z.infer<typeof DocsSchema>;
