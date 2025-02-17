---
title: Schema Documentation
description: Understanding Content Configuration and Schema Design
---

Below is an example of how you might rewrite your schemas using both `.optional()` and `.nullable()` for clarity and flexibility. The comments tell the story of our content—how each field is designed to be forgiving, ensuring our app can gracefully handle missing or intentionally empty data.

```ts
// src/content/config.ts

/**
 * Welcome to our Content Configuration!
 *
 * In this file, we define our content collections and their schemas using Zod.
 * We're writing a story about our content: blog posts, documentation, and creative prompts.
 *
 * Here's the twist: we're using both `.optional()` and `.nullable()` on many fields.
 * - `.optional()` lets a field be omitted (i.e., it might not appear at all).
 * - `.nullable()` allows the field to explicitly be set to `null`.
 *
 * This dual approach makes our schema human-friendly and flexible,
 * ensuring our application can handle cases where data might be missing or intentionally empty.
 */

import { defineCollection, z } from 'astro:content';

/**
 * Blog Schema – Telling the Story of Our Posts
 *
 * Every blog post needs a captivating title, but other details can be left blank if needed.
 */
const BlogSchema = z.object({
  # The headline of our story—essential to grab the reader's attention.
  title: z.string(),

  # A brief description to pique curiosity; it's okay if this is missing or set to null.
  description: z.string().optional().nullable(),

  # The publication date of the post; optional in case the date isn't set or is unknown.
  date: z.date().optional().nullable(),

  # Is this post still a work in progress? If not provided, we treat it as not a draft.
  draft: z.boolean().optional().nullable(),

  # A visual representation of the story; optional for creative freedom.
  picture: z.string().optional().nullable(),

  # An alternative image URL; again, optional and can be null.
  image: z.string().optional().nullable(),

  # The type or category of the post; optional to allow for broad storytelling.
  type: z.string().optional().nullable(),

  # Tags to help classify the post; optional so you can skip them if not needed.
  tags: z.array(z.string()).optional().nullable(),
});

/**
 * Docs Schema – Your Guiding Light
 *
 * Documentation entries guide our users through the ins and outs of our project.
 * While some fields are essential for clarity, others can be left flexible.
 */
const DocsSchema = z.object({
  # A clear title for the documentation—vital for orientation.
  title: z.string(),

  # A detailed description that explains the purpose of the docs.
  description: z.string(),

  # The publication date to keep our guides in order.
  date: z.date(),

  # Indicates if this doc is still in draft form; optional to allow for updates.
  draft: z.boolean().optional().nullable(),

  # Which section of our docs does this belong to? Optional for additional organization.
  section: z.string().optional().nullable(),

  # An order value to control the sequence of documentation; optional for sorting flexibility.
  order: z.number().optional().nullable(),
});

/**
 * Prompts Schema – Sparking Creativity
 *
 * Prompts are designed to ignite your creativity. They need a title and description,
 * and can be grouped with tags. The draft status is optional, so you can fine-tune them.
 */
const PromptsSchema = z.object({
  # The spark that starts the creative fire—a catchy title.
  title: z.string(),

  # A description that sets the stage for creative exploration.
  description: z.string(),

  # Tags that help you find similar prompts; optional if you're keeping it simple.
  tags: z.array(z.string()).optional().nullable(),

  # Indicates if the prompt is still in draft mode; optional to let you iterate.
  draft: z.boolean().optional().nullable(),
});

/**
 * Now, we define our content collections using the schemas above.
 * Each collection corresponds to a type of content in our Astro project.
 */
export const blog = defineCollection({
  type: 'content',
  schema: BlogSchema,
});

export const docs = defineCollection({
  type: 'content',
  schema: DocsSchema,
});

export const prompts = defineCollection({
  type: 'content',
  schema: PromptsSchema,
});

/**
 * For convenience, we export all our collections as a single object.
 * This makes it easier to reference them throughout our project.
 */
export const collections = {
  blog,
  docs,
  prompts,
};

/**
 * To leverage TypeScript's power, we export the inferred types from our schemas.
 * This ensures type safety and provides excellent editor support as we build our app.
 */
export type Blog = z.infer<typeof BlogSchema>;
export type Docs = z.infer<typeof DocsSchema>;
export type Prompts = z.infer<typeof PromptsSchema>;
```

quick_recap:
  storytelling_through_code:
    description: Each schema is commented like a narrative, explaining the purpose of each field and why it might be optional or nullable.
  
  flexibility:
    description: By combining .optional() and .nullable(), we allow our data to be flexible—perfect for when details are missing or intentionally left blank.
  
  type_safety:
    description: Exporting the inferred types ensures that our application remains robust and that we catch errors early in the development process.

This setup not only makes your schemas human-readable but also maintains the robustness and flexibility required in a real-world Astro project. Enjoy coding and telling your content's story!