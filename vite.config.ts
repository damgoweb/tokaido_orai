import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig(({ mode }) => {
  // modeに応じて環境変数を読み込む
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/', // 環境変数からbaseパスを設定。なければ'/'
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt'],
        manifest: false // public/manifest.jsonを使用
      })
    ],
        resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@services': path.resolve(__dirname, './src/services'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@types': path.resolve(__dirname, './src/types'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@constants': path.resolve(__dirname, './src/constants'),
        '@store': path.resolve(__dirname, './src/store')
      }
    },
    server: {
      host: true,
      port: 5173,
      strictPort: true
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'map-vendor': ['leaflet', 'react-leaflet'],
            'audio-vendor': ['wavesurfer.js']
          }
        }
      }
    }
  };
});