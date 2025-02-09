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
      cssCodeSplit: true,
      cssMinify: true,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[hash][extname]',
          chunkFileNames: 'chunks/[hash].js',
          entryFileNames: 'entries/[hash].js',
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
    },
    css: {
      modules: {
        generateScopedName: '[hash:base64:8]'
      }
    }
  }
});