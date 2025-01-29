// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import netlify from '@astrojs/netlify';

export default defineConfig({
  integrations: [react(), tailwind(), partytown()],
  markdown: {
    // markdown config
  },
  vite: {
    assetsInclude: ['**/*.md'],
    build: {
      rollupOptions: {
        output: {  // <-- Moved manualChunks under output
          manualChunks(id) {
            if (id.includes('@assistant-ui/react')) {
              return 'assistant-ui-chunk';
            }
          }
        }
      }
    },
    ssr: {
      noExternal: ['@assistant-ui/react']
    }
  },
  output: 'server',
  adapter: netlify()
});