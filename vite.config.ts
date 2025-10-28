import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default defineConfig({
  base: '/document',
  publicDir: 'public',
  resolve: {
    alias: {
      '@/lib': resolve(__dirname, 'lib'),
      '@/store': resolve(__dirname, 'store'),
      '@/assets': resolve(__dirname, 'assets'),
      '@/types': resolve(__dirname, 'types'),
      '@/styles': resolve(__dirname, 'styles'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/base.css";`,
      },
    },
  },
  plugins: [
    {
      name: 'exclude-large-wasm',
      closeBundle() {
        // After build, remove the large uncompressed WASM file
        const wasmPath = path.resolve(__dirname, 'dist/wasm/x2t/x2t.wasm');
        try {
          if (fs.existsSync(wasmPath)) {
            fs.unlinkSync(wasmPath);
            console.log('Removed large x2t.wasm file (using compressed version instead)');
          }
        } catch (error) {
          console.warn('Could not remove x2t.wasm:', error);
        }
      },
    },
  ],
});
