import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode !== 'test' &&
      checker({
        typescript: true,
        overlay: {
          initialIsOpen: false,
        },
        eslint: {
          useFlatConfig: true,
          lintCommand: 'eslint src',
          dev: {
            logLevel: ['warning', 'error'],
          },
        },
      }),
  ].filter(Boolean),
}));
