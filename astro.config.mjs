// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false
    }),
  ],
  markdown: {
    // markdown config
  },
  vite: {
    assetsInclude: ['**/*.md'],
    build: {
      chunkSizeWarningLimit: 1800,     
    },
    ssr: {
      noExternal: ['@assistant-ui/react']
    }
  },
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    imageService: true,
  })
});