'use strict';

import { defineConfig } from 'eslint/config';
import eslintJs from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';

export default defineConfig([
  // React configuration for client
  {
    files: ['client/**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser
      }
    }
  },
  // Node.js configuration for server
  {
    files: ['server/**/*.js'],
    extends: [eslintJs.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
]);
