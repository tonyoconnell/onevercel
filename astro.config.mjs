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
  }),
  vite: {
    ssr: {
      noExternal: ['@radix-ui/*', 'lucide-react', '@assistant-ui/*'],
    },
    optimizeDeps: {
      include: ['@radix-ui/react-slot', 'lucide-react', 'nanoid/non-secure/index.js']
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'lucide-icons': ['lucide-react']
          }
        }
      }
    },
    resolve: {
      alias: {
        'nanoid/non-secure': 'nanoid/non-secure/index.js'
      }
    }
  }
});