import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import svgrPlugin from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    svgrPlugin(),
    mode !== 'test' &&
      checker({
        typescript: true,
        eslint: {
          useFlatConfig: true,
          lintCommand: 'eslint src',
          dev: {
            logLevel: ['warning', 'error'],
          },
        },
      }),
  ].filter(Boolean),

  build: {
    sourcemap: true,
  },
}));
