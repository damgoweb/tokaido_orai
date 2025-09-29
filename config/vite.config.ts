import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@services': path.resolve(__dirname, '../src/services'),
      '@hooks': path.resolve(__dirname, '../src/hooks'),
      '@utils': path.resolve(__dirname, '../src/utils'),
      '@types': path.resolve(__dirname, '../src/types'),
      '@assets': path.resolve(__dirname, '../src/assets'),
      '@constants': path.resolve(__dirname, '../src/constants'),
      '@store': path.resolve(__dirname, '../src/store')
    }
  }
});