import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    // Test environment configuration
    environment: 'node',
    globals: true,
    
    // Test file patterns
    include: [
      '1/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.spec.ts'
      ]
    },

    // Setup files
    setupFiles: ['./1/test.setup.ts'],

    // Mocking configuration
    mockReset: true,
    
    // Test timeouts
    testTimeout: 10000,
    hookTimeout: 10000,

    // Parallel execution
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false
      }
    },

    // Retry failed tests
    retry: 0,

    // Snapshot configuration
    snapshotFormat: {
      printBasicPrototype: false,
      escapeString: false
    },

    // Custom resolvers
    alias: {
      '@': resolve(__dirname, './1'),
      '@test': resolve(__dirname, './test'),
      '@types': resolve(__dirname, './types')
    }
  }
}); 