import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@db': path.resolve(__dirname, '../lib/db'),
      '@lib': path.resolve(__dirname, '../lib'),
    },
  },
  build: {
    outDir: '../dist/public',
    emptyOutDir: true
  }
}); 