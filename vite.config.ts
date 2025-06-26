import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint({
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['node_modules/**', 'dist/**'],
      cache: true,
      fix: true,
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    hmr: {
      overlay: false,
      clientPort: 5173,
    },
    watch: {
      include: ['src/**/*.{ts,tsx}'],
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'development'
    ), // Ensure NODE_ENV is set correctly
  },
});
