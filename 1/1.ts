import { z } from "zod";

// Navigation item schema
const navigationItemSchema = z.object({
  title: z.string(),
  path: z.string(),
  icon: z.string()
});

// Logo schema
export const logoSchema = z.object({
  default: z.string(),
  dark: z.string(),
  light: z.string(),
});

// Favicon schema
export const faviconSchema = z.object({
  ico: z.string(),
  png: z.string(),
  svg: z.string(),
  sizes: z.array(z.number()),
});

// Colors schema
export const colorsSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  background: z.string(),
  text: z.string(),
  light: z.record(z.string()),
  dark: z.record(z.string()),
});

// Fonts schema
export const fontsSchema = z.object({
  heading: z.string(),
  body: z.string(),
  code: z.string(),
  system: z.object({
    sans: z.string(),
    serif: z.string(),
    mono: z.string(),
  }),
});

// Contact schema
export const contactSchema = z.object({
  email: z.string(),
  phone: z.string(),
  whatsapp: z.string(),
  telegram: z.string(),
  address: z.object({
    street: z.string(),
    area: z.string(),
    city: z.string(),
    county: z.string(),
    country: z.string(),
  }),
  social: z.object({
    github: z.string(),
    twitter: z.string(),
    linkedin: z.string(),
    instagram: z.string(),
    youtube: z.string(),
    discord: z.string(),
    medium: z.string().nullable(),
    facebook: z.string(),
    tiktok: z.string().nullable(),
    threads: z.string().nullable(),
    mastodon: z.string().nullable(),
    slack: z.string(),
    telegram_channel: z.string(),
  }),
});

// SEO schema
export const seoSchema = z.object({
  canonical: z.string().url(),
  title: z.string().min(1).max(70),
  metaTitle: z.string().min(1).max(70),
  metaDescription: z.string().min(1).max(200),
  metaKeywords: z.array(z.string()),
  metaRobots: z.string().default("index, follow"),
  openGraph: z.object({
    type: z.string(),
    title: z.string(),
    description: z.string(),
    image: z.object({
      url: z.string(),
      width: z.number(),
      height: z.number(),
      alt: z.string(),
      type: z.string()
    }),
    locale: z.string(),
    site_name: z.string()
  }).default({
    type: 'article',
    title: '',
    description: '',
    image: {
      url: '',
      width: 1200,
      height: 630,
      alt: '',
      type: 'image/jpeg'
    },
    locale: 'en_IE',
    site_name: 'ONE'
  }),
  twitter: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    card: z.string(),
    site: z.string(),
    creator: z.string()
  }).default({
    title: '',
    description: '',
    image: '',
    card: 'summary_large_image',
    site: '@onedotie',
    creator: '@tonyoconnell'
  })
});

// Navigation schema
export const navigationSchema = z.object({
  top: z.object({
    logo: z.string(),
    favicon: z.string(),
    items: z.array(navigationItemSchema),
    buttons: z.array(navigationItemSchema),
  }),
  sidebar: z.array(navigationItemSchema),
  footer: z.object({
    columns: z.array(z.object({
      title: z.string(),
      links: z.array(navigationItemSchema),
    })),
    bottom: z.object({
      copyright: z.string().optional(),
      links: z.array(navigationItemSchema),
    })
  })
});

// Layout schema
export const layoutSchema = z.object({
  showLeft: z.boolean(),
  showRight: z.boolean(),
  showTop: z.boolean(),
  showBottom: z.boolean(),
  rightSize: z.enum(['Full', 'Half', 'Quarter', 'Closed'])
});

// AI schema
export const aiSchema = z.object({
  provider: z.string(),
  model: z.string(),
  temperature: z.number(),
  maxTokens: z.number(),
  welcome: z.object({
    message: z.string(),
    suggestions: z.array(z.object({
      label: z.string(),
      prompt: z.string()
    }))
  })
});

// Main config schema
export const ConfigSchema = z.object({
  business: z.object({
    name: z.string(),
    description: z.string(),
    contact: contactSchema,
    seo: seoSchema
  }),
  brand: z.object({
    logo: logoSchema,
    favicon: faviconSchema,
    colors: colorsSchema,
    fonts: fontsSchema
  }),
  page: z.object({
    layout: layoutSchema,
    navigation: navigationSchema
  }),
  ai: aiSchema
});

export type Config = z.infer<typeof ConfigSchema>;