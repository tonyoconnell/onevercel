// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

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
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    imageService: true,
    maxDuration: 60
  }),
  vite: {
    ssr: {
      noExternal: ['@radix-ui/*', '@assistant-ui/*', 'lucide-react']
    },
    build: {
      chunkSizeWarningLimit: 1000,
      target: 'node18',
      rollupOptions: {
        maxParallelFileOps: 5,
        output: {
          entryFileNames: 'entry.[hash].mjs',
          chunkFileNames: 'chunks/[name].[hash].mjs',
          assetFileNames: 'assets/[name].[hash][extname]',
          manualChunks(id) {
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            if (id.includes('node_modules')) {
              if (id.includes('@radix-ui')) return 'radix';
              if (id.includes('@assistant-ui')) return 'assistant';
              return 'vendor';
            }
          }
        }
      }
    }
  }
});