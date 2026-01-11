import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Config de Next.js y TypeScript
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Integración con Prettier
  ...compat.extends('plugin:prettier/recommended'),

  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'template franco/**',
    ],
  },
];

export default eslintConfig;
