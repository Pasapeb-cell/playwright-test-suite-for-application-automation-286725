import tseslint from 'typescript-eslint';
import js from '@eslint/js';
import playwright from 'eslint-plugin-playwright';

export default [
  {
    ignores: [
      'node_modules/**',
      'test-results/**',
      'playwright-report/**',
      'coverage/**',
      'dist/**'
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,mjs,cjs}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        process: true
      }
    },
    plugins: { playwright },
    rules: {
      ...js.configs.recommended.rules,
      'playwright/no-conditional-in-test': 'warn',
      'playwright/no-networkidle': 'off'
    }
  }
];
