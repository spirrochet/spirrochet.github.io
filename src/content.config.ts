import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Technical track: the full case studies, served at /case-studies/<id>/.
const caseStudies = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    description: z.string().min(40),
    started: z.coerce.date(),
    status: z.enum(['in progress', 'complete']),
    order: z.number().int(),
  }),
});

// Plain track: the same story told as if in person, served at /stories/<id>/.
// `caseStudy` names its technical twin, if it has one.
const stories = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    description: z.string().min(40),
    caseStudy: z.string().optional(),
    order: z.number().int(),
  }),
});

export const collections = { caseStudies, stories };
