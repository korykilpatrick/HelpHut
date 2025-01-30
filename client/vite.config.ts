import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import path from 'path';

export default defineConfig({
  plugins: [react(), runtimeErrorOverlay(), themePlugin()],
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