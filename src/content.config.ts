// The shape of the site's words (Content's files in src/content/). The build fails if a file is missing a field, so
// the design can rely on it. A file with `draft: true` shows the draft tag.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const link = z.object({
  label: z.string(),
  href: z.url(),
});

const site = defineCollection({
  loader: glob({ pattern: 'site.md', base: './src/content' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    fullName: z.string(),
    title: z.string(),
    description: z.string(),
    lede: z.string(),
    social: z.array(link),
    footer: z.array(z.string()),
    draftTag: z.string(),
    ui: z.object({
      skip: z.string(),
      elsewhere: z.string(),
      backToTop: z.string(),
      opensOutside: z.string(),
      // The button on the first screen that opens every folded line, and its words once they are open.
      readAll: z.string(),
      foldAll: z.string(),
    }),
    notFound: z.object({ title: z.string(), text: z.string(), link: z.string() }),
    draft: z.boolean(),
    sources: z.array(z.string()),
  }),
});

const sections = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/sections' }),
  schema: ({ image }) => z.object({
    order: z.number().int(),
    anchor: z.string().regex(/^[a-z][a-z0-9-]*$/),
    kicker: z.string(),
    title: z.string(),
    state: z.string().optional(),
    links: z.array(link).default([]),
    portrait: z.object({ src: image(), alt: z.string() }).optional(),
    history: z.array(z.object({ years: z.string(), role: z.string(), org: z.string() })).optional(),
    historyTitle: z.string().optional(),
    // Small things, shown as small cards (the "btw" section): a title, a state, a text (a line break in it starts a
    // new paragraph), the links, and one small picture, either up to four of the thing's own pictures (`art`) or a
    // still (`still`; `video` when the still is a video's, `focus` where its subject is). A thing that is not out yet
    // may have no link and no picture.
    items: z.array(z.object({
      title: z.string(),
      state: z.string(),
      text: z.string(),
      links: z.array(link).default([]),
      art: z.array(z.string().startsWith('/media/')).min(1).max(4).optional(),
      still: z.object({
        src: image(),
        focus: z.string().regex(/^\d{1,3}% \d{1,3}%$/).optional(),
        video: z.boolean().default(false),
      }).optional(),
    }).refine((item) => !(item.art && item.still), { message: 'Give an item art or a still, not both.' })).optional(),
    draft: z.boolean(),
    sources: z.array(z.string()),
  }),
});

export const collections = { site, sections };
