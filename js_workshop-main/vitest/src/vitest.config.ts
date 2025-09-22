import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    // globals: true,
    name: 'vitest mock workshop',
    reporters: ['html', 'default'],
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    //testNamePattern: /.\.trello\.*/,
    //exclude: ['**\/tests/**'],
    //testNamePattern: 'src/trello.test.ts',
    hideSkippedTests: true,
    allowOnly: true,
    testTimeout: 60000,
    dir: './src',
    root: './'
  }
});