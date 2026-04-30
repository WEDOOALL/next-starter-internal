import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    // Exclude Playwright E2E specs — they use Playwright's `test()` and `test.describe()`
    // which conflict with Vitest's. They run via `pnpm test:e2e`.
    exclude: ['e2e/**', 'node_modules/**', '.next/**', 'dist/**'],
    // Allow zero-test runs (template ships without unit tests for the apps to add later).
    passWithNoTests: true,
    environment: 'node',
    // Globals like `describe`, `it`, `expect` available without import — matches Jest ergonomics.
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
