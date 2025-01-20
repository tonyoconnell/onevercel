import { defineCollection, z } from 'astro:content';

// Define the Course schema
const CourseSchema = z.object({
	title: z.string(),
	description: z.string(),
	date: z.date(),
	draft: z.boolean().optional(),
	picture: z.string().optional(),
	image: z.string().optional()
});

// Define the Course collection schema
const Course = defineCollection({
	type: 'content',
	schema: CourseSchema,
});

export const collections = {
	'Course': Course
};

// Export the Course schema type
export type CourseSchema = z.infer<typeof CourseSchema>;

