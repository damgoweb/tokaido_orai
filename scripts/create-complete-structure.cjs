// scripts/create-complete-structure.js

const fs = require('fs');
const path = require('path');

console.log('🏗️ 東海道往来アプリ - 完全なディレクトリ構造を作成開始\n');

// ========================================
// ディレクトリ構造の定義
// ========================================
const directories = [
  // src/components配下
  'src/components',
  'src/components/common',
  'src/components/text',
  'src/components/audio',
  'src/components/map',
  'src/components/layout',
  
  // src/services配下
  'src/services',
  'src/services/audio',
  'src/services/map',
  'src/services/sync',
  'src/services/storage',
  
  // src/store配下
  'src/store',
  'src/store/slices',
  'src/store/types',
  
  // src直下のその他ディレクトリ
  'src/hooks',
  'src/utils',
  'src/types',
  'src/constants',
  
  // src/assets配下
  'src/assets',
  'src/assets/data',
  'src/assets/styles',
  
  // ルートレベルのディレクトリ
  'public',
  'public/icons',
  'public/fonts',
  
  'tests',
  'tests/unit',
  'tests/integration',
  'tests/e2e',
  'tests/fixtures',
  
  'config',
  'scripts',
  '.github',
  '.github/workflows',
  '.devcontainer',
  '.vscode',
  'docs'
];

// ========================================
// ファイル内容の定義
// ========================================
const files = {
  // ========== src直下のメインファイル ==========
  'src/App.tsx': `import React from 'react';
import { Layout } from './components/layout';
import { MapView } from './components/map';
import { TextView } from './components/text';
import { AudioView } from './components/audio';
import './assets/styles/global.css';

function App() {
  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        <MapView />
        <TextView />
        <AudioView />
      </div>
    </Layout>
  );
}

export default App;
`,

  'src/main.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,

  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

/* カスタムスタイル */
@layer base {
  :root {
    --tokaido-primary: #8B4513;
    --tokaido-secondary: #D2691E;
    --tokaido-background: #FAFAFA;
  }
}

@layer components {
  .writing-mode-vertical {
    writing-mode: vertical-rl;
    text-orientation: upright;
  }
}
`,

  'src/vite-env.d.ts': `/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_MAP_TILE_URL: string;
  readonly VITE_MAP_ATTRIBUTION: string;
  readonly VITE_AUDIO_SAMPLE_RATE: number;
  readonly VITE_AUDIO_BIT_RATE: number;
  readonly VITE_ENABLE_DEBUG: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
`,

  // ========== コンポーネントファイル ==========
  'src/components/layout/index.ts': `export { default as Layout } from './Layout';
export { default as Header } from './Header';
export { default as Footer } from './Footer';
`,

  'src/components/layout/Layout.tsx': `import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-hidden p-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
`,

  'src/components/layout/Header.tsx': `import React from 'react';
import { ControlPanel } from '../common/ControlPanel';
import { SettingsMenu } from '../common/SettingsMenu';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md px-4 py-3">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-tokaido-primary">
          東海道往来
        </h1>
        <div className="flex gap-4">
          <ControlPanel />
          <SettingsMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
`,

  'src/components/layout/Footer.tsx': `import React from 'react';
import { ProgressBar } from '../common/ProgressBar';
import { Timeline } from '../common/Timeline';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t px-4 py-2">
      <ProgressBar />
      <Timeline />
    </footer>
  );
};

export default Footer;
`,

  'src/components/text/index.ts': `export { default as TextView } from './TextView';
export { default as TextDisplay } from './TextDisplay';
export { default as TextControls } from './TextControls';
`,

  'src/components/text/TextView.tsx': `import React from 'react';
import TextDisplay from './TextDisplay';
import TextControls from './TextControls';

const TextView: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
      <TextControls />
      <TextDisplay />
    </div>
  );
};

export default TextView;
`,

  'src/components/audio/index.ts': `export { default as AudioView } from './AudioView';
export { default as AudioRecorder } from './AudioRecorder';
export { default as AudioPlayer } from './AudioPlayer';
export { default as WaveformDisplay } from './WaveformDisplay';
`,

  'src/components/audio/AudioView.tsx': `import React from 'react';
import AudioRecorder from './AudioRecorder';
import AudioPlayer from './AudioPlayer';
import WaveformDisplay from './WaveformDisplay';

const AudioView: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
      <AudioRecorder />
      <WaveformDisplay />
      <AudioPlayer />
    </div>
  );
};

export default AudioView;
`,

  'src/components/map/index.ts': `export { default as MapView } from './MapView';
export { default as MapContainer } from './MapContainer';
export { default as MapControls } from './MapControls';
export { default as StationMarkers } from './StationMarkers';
`,

  'src/components/map/MapView.tsx': `import React from 'react';
import MapContainer from './MapContainer';
import MapControls from './MapControls';

const MapView: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full relative">
      <MapContainer />
      <MapControls />
    </div>
  );
};

export default MapView;
`,

  // ========== サービスファイル ==========
  'src/services/audio/index.ts': `export { default as AudioService } from './AudioService';
export { default as RecordingService } from './RecordingService';
export { default as PlaybackService } from './PlaybackService';
`,

  'src/services/audio/AudioService.ts': `class AudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;

  async startRecording(): Promise<void> {
    // 録音開始ロジック
  }

  async stopRecording(): Promise<Blob> {
    // 録音停止ロジック
    return new Blob();
  }
}

export default new AudioService();
`,

  'src/services/map/index.ts': `export { default as MapService } from './MapService';
export { default as GeolocationService } from './GeolocationService';
`,

  'src/services/sync/index.ts': `export { default as SyncService } from './SyncService';
export { default as TimestampService } from './TimestampService';
`,

  'src/services/storage/index.ts': `export { default as StorageService } from './StorageService';
export { default as IndexedDBService } from './IndexedDBService';
`,

  // ========== ストア関連 ==========
  'src/store/index.ts': `export { default as useAppStore } from './useAppStore';
export * from './types';
`,

  'src/store/useAppStore.ts': `import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AppState } from './types';

const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初期状態
        textState: {
          segments: [],
          currentSegmentId: null,
          displayMode: 'vertical',
          fontSize: 'medium',
          showRuby: true
        },
        audioState: {
          isRecording: false,
          isPlaying: false,
          currentTime: 0,
          duration: 0,
          volume: 1.0,
          playbackRate: 1.0
        },
        mapState: {
          currentStationId: null,
          zoomLevel: 8,
          followMode: true
        },
        // アクション
        actions: {
          setCurrentSegment: (segmentId: string) => {
            set((state) => ({
              textState: {
                ...state.textState,
                currentSegmentId: segmentId
              }
            }));
          }
        }
      }),
      {
        name: 'tokaido-app-storage'
      }
    )
  )
);

export default useAppStore;
`,

  'src/store/types/index.ts': `export interface AppState {
  textState: TextState;
  audioState: AudioState;
  mapState: MapState;
  actions: Actions;
}

export interface TextState {
  segments: any[];
  currentSegmentId: string | null;
  displayMode: 'vertical' | 'horizontal';
  fontSize: 'small' | 'medium' | 'large';
  showRuby: boolean;
}

export interface AudioState {
  isRecording: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
}

export interface MapState {
  currentStationId: number | null;
  zoomLevel: number;
  followMode: boolean;
}

export interface Actions {
  setCurrentSegment: (segmentId: string) => void;
}
`,

  // ========== フック ==========
  'src/hooks/index.ts': `export { default as useAudioRecorder } from './useAudioRecorder';
export { default as useMapSync } from './useMapSync';
export { default as useTextHighlight } from './useTextHighlight';
`,

  // ========== ユーティリティ ==========
  'src/utils/index.ts': `export * from './errorHandler';
export * from './validation';
export * from './formatters';
`,

  // ========== 型定義 ==========
  'src/types/index.ts': `export * from './models';
export * from './api';
export * from './common';
`,

  'src/types/models.ts': `export interface Station {
  id: number;
  name: string;
  historicalName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  modernCity: string;
  description?: string;
}

export interface TokaidoSegment {
  id: string;
  stationId: number;
  text: string;
  ruby?: string;
  startOffset: number;
  endOffset: number;
}

export interface Recording {
  id: string;
  title: string;
  blob: Blob;
  duration: number;
  format: string;
  createdAt: Date;
  updatedAt: Date;
}
`,

  // ========== 定数 ==========
  'src/constants/index.ts': `export * from './stations';
export * from './config';
`,

  'src/constants/stations.ts': `import { Station } from '@/types';

export const TOKAIDO_STATIONS: Station[] = [
  {
    id: 1,
    name: "日本橋",
    historicalName: "日本橋",
    coordinates: { lat: 35.6840, lng: 139.7744 },
    modernCity: "東京都中央区",
    description: "東海道の起点"
  },
  // 他の宿場データ...
];
`,

  // ========== アセット ==========
  'src/assets/data/tokaidoText.json': `{
  "title": "東海道往来",
  "segments": [
    {
      "id": "seg_001",
      "text": "都路は五十余りに密の宿",
      "ruby": "みやこじはごじゅうあまりにみつのしゅく"
    }
  ]
}`,

  'src/assets/styles/global.css': `/* グローバルスタイル */
.tokaido-container {
  max-width: 1400px;
  margin: 0 auto;
}
`,

  // ========== 公開ファイル ==========
  'public/index.html': `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="東海道五十三次の朗読と地図を連動させた文化継承アプリ">
  <title>東海道往来 - インタラクティブ朗読</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="manifest" href="/manifest.json">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`,

  'public/manifest.json': `{
  "name": "東海道往来 インタラクティブ朗読",
  "short_name": "東海道往来",
  "description": "東海道五十三次の朗読と地図を連動させた文化継承アプリ",
  "start_url": "/",
  "display": "standalone",
  "orientation": "any",
  "theme_color": "#8B4513",
  "background_color": "#FAFAFA",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}`,

  'public/robots.txt': `User-agent: *
Allow: /

Sitemap: https://tokaido-app.example.com/sitemap.xml`,

  // ========== テストファイル ==========
  'tests/unit/example.test.ts': `import { describe, it, expect } from 'vitest';

describe('Example Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});`,

  'tests/integration/.gitkeep': '',
  'tests/e2e/.gitkeep': '',
  'tests/fixtures/.gitkeep': '',

  // ========== 設定ファイル ==========
  'config/vite.config.ts': `import { defineConfig } from 'vite';
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
});`,

  // ========== プロジェクトルート設定ファイル ==========
  '.gitignore': `# Dependencies
node_modules/
/.pnp
.pnp.js

# Production
/dist
/build

# Testing
/coverage

# Editor
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea/
*.swp
*.swo
*~
.DS_Store

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Cache
.eslintcache
.stylelintcache
*.tsbuildinfo

# Misc
*.log
.cache/
.temp/
.tmp/
`,

  '.env.example': `# アプリケーション設定
VITE_APP_NAME=東海道往来
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# 地図設定
VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
VITE_MAP_ATTRIBUTION=© OpenStreetMap contributors

# 音声設定
VITE_AUDIO_SAMPLE_RATE=48000
VITE_AUDIO_BIT_RATE=128000

# デバッグ設定
VITE_ENABLE_DEBUG=false
VITE_LOG_LEVEL=info`,

  'package.json': `{
  "name": "tokaido-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write 'src/**/*.{ts,tsx,css,md,json}'",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist node_modules .turbo",
    "clean:cache": "rm -rf node_modules/.cache .eslintcache"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "zustand": "^4.4.7",
    "wavesurfer.js": "^7.4.5",
    "dexie": "^3.2.4",
    "clsx": "^2.0.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@types/leaflet": "^1.9.8",
    "@types/node": "^20.10.5",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "@vitest/ui": "^1.0.4",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "prettier": "^3.1.1",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "vite-plugin-pwa": "^0.17.4",
    "vitest": "^1.0.4"
  }
}`,

  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@services/*": ["src/services/*"],
      "@hooks/*": ["src/hooks/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"],
      "@assets/*": ["src/assets/*"],
      "@constants/*": ["src/constants/*"],
      "@store/*": ["src/store/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,

  'tsconfig.node.json': `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "config/*.ts"]
}`,

  'vite.config.ts': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
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
});`,

  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tokaido': {
          primary: '#8B4513',
          secondary: '#D2691E',
          background: '#FAFAFA'
        }
      },
      fontFamily: {
        'mincho': ['Noto Serif JP', 'serif'],
        'gothic': ['Noto Sans JP', 'sans-serif']
      }
    },
  },
  plugins: [],
}`,

  'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

  '.eslintrc.cjs': `module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}`,

  '.prettierrc': `{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}`,

  'README.md': `# 東海道往来 インタラクティブ朗読アプリケーション

## 概要
江戸時代の東海道五十三次を題材にした「東海道往来」をインタラクティブに朗読できるWebアプリケーションです。

## 機能
- 📖 東海道往来の全文表示（縦書き/横書き切り替え可能）
- 🎙️ 音声録音・再生機能
- 🗺️ 東海道五十三次の地図連動表示
- 🔄 テキスト・音声・地図の自動同期

## セットアップ

### Docker環境（推奨）
\`\`\`bash
# 初期セットアップ
make setup

# 開発サーバー起動
make up

# http://localhost:5173 でアクセス
\`\`\`

### ローカル環境
\`\`\`bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
\`\`\`

## 開発コマンド
- \`npm run dev\` - 開発サーバー起動
- \`npm run build\` - プロダクションビルド
- \`npm run test\` - テスト実行
- \`npm run lint\` - リント実行
- \`npm run format\` - コードフォーマット

## 技術スタック
- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand
- **Map**: Leaflet + OpenStreetMap
- **Audio**: Web Audio API + Wavesurfer.js
- **Storage**: IndexedDB (Dexie.js)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **PWA**: Workbox

## ライセンス
MIT License
`,

  'Dockerfile.dev': `FROM node:20-alpine AS base

RUN apk add --no-cache git python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

FROM base AS dev-deps
RUN npm ci

FROM base AS development
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]`,

  'docker-compose.yml': `version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
      target: development
    container_name: tokaido-app
    ports:
      - "5173:5173"
    volumes:
      - ./src:/app/src
      - ./public:/app/public
      - ./index.html:/app/index.html
      - ./vite.config.ts:/app/vite.config.ts
      - ./tsconfig.json:/app/tsconfig.json
      - ./tailwind.config.js:/app/tailwind.config.js
      - node_modules:/app/node_modules
    environment:
      - NODE_ENV=development
      - CHOKIDAR_USEPOLLING=true
    networks:
      - tokaido-network

volumes:
  node_modules:
    driver: local

networks:
  tokaido-network:
    driver: bridge`,

  '.dockerignore': `node_modules
npm-debug.log
dist
.git
.gitignore
README.md
.env
.env.*
.cache
.vscode
.idea
*.swp
*.swo
.DS_Store`,

  'Makefile': `# Makefile for 東海道往来アプリ

.PHONY: help setup structure up down build logs shell clean test lint format

help:
	@echo "使用可能なコマンド:"
	@echo "  make setup      - 完全な初期セットアップ"
	@echo "  make structure  - ディレクトリ構造の作成"
	@echo "  make up         - 開発環境起動"
	@echo "  make down       - 開発環境停止"
	@echo "  make build      - イメージ再ビルド"
	@echo "  make logs       - ログ表示"
	@echo "  make shell      - コンテナにログイン"
	@echo "  make clean      - クリーンアップ"
	@echo "  make test       - テスト実行"
	@echo "  make lint       - リント実行"
	@echo "  make format     - コードフォーマット"

setup: structure
	@echo "🚀 初期セットアップを開始..."
	@cp -n .env.example .env || true
	@docker-compose build --no-cache
	@docker-compose run --rm app npm ci
	@echo "✅ セットアップ完了"
	@echo "📌 'make up' で開発サーバーを起動してください"

structure:
	@echo "📁 ディレクトリ構造を作成中..."
	@node scripts/create-complete-structure.js

up:
	@docker-compose up -d
	@echo "🌐 開発サーバー起動: http://localhost:5173"

down:
	@docker-compose down

build:
	@docker-compose build --no-cache

logs:
	@docker-compose logs -f app

shell:
	@docker-compose exec app sh

clean:
	@docker-compose down -v
	@rm -rf node_modules dist .turbo
	@echo "🧹 クリーンアップ完了"

test:
	@docker-compose exec app npm test

lint:
	@docker-compose exec app npm run lint

format:
	@docker-compose exec app npm run format`,
};

// ========================================
// ディレクトリ作成処理
// ========================================
console.log('📁 ディレクトリを作成中...\n');

directories.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`  ✅ ${dir}`);
  } else {
    console.log(`  ⏭️  ${dir} (既存)`);
  }
});

// ========================================
// ファイル作成処理
// ========================================
console.log('\n📄 ファイルを作成中...\n');

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  const dir = path.dirname(fullPath);
  
  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`  ✅ ${filePath}`);
  } else {
    console.log(`  ⏭️  ${filePath} (既存)`);
  }
});

// ========================================
// プレースホルダーファイルの作成
// ========================================
const placeholders = [
  'src/components/common/ControlPanel.tsx',
  'src/components/common/SettingsMenu.tsx',
  'src/components/common/ProgressBar.tsx',
  'src/components/common/Timeline.tsx',
  'src/components/text/TextDisplay.tsx',
  'src/components/text/TextControls.tsx',
  'src/components/audio/AudioRecorder.tsx',
  'src/components/audio/AudioPlayer.tsx',
  'src/components/audio/WaveformDisplay.tsx',
  'src/components/map/MapContainer.tsx',
  'src/components/map/MapControls.tsx',
  'src/components/map/StationMarkers.tsx',
  'src/hooks/useAudioRecorder.ts',
  'src/hooks/useMapSync.ts',
  'src/hooks/useTextHighlight.ts',
  'src/utils/errorHandler.ts',
  'src/utils/validation.ts',
  'src/utils/formatters.ts',
  'src/services/map/MapService.ts',
  'src/services/map/GeolocationService.ts',
  'src/services/sync/SyncService.ts',
  'src/services/sync/TimestampService.ts',
  'src/services/storage/StorageService.ts',
  'src/services/storage/IndexedDBService.ts',
  'src/services/audio/RecordingService.ts',
  'src/services/audio/PlaybackService.ts',
];

placeholders.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    const componentName = path.basename(filePath, path.extname(filePath));
    const isComponent = filePath.includes('components');
    
    const content = isComponent
      ? `import React from 'react';\n\nconst ${componentName}: React.FC = () => {\n  return <div>${componentName}</div>;\n};\n\nexport default ${componentName};\n`
      : `// ${componentName} implementation\n\nexport default {};\n`;
    
    fs.writeFileSync(fullPath, content, 'utf8');
  }
});

// ========================================
// 構造の検証
// ========================================
console.log('\n🔍 ディレクトリ構造を検証中...\n');

const requiredPaths = [
  'src/App.tsx',
  'src/components',
  'src/services',
  'src/store',
  'src/hooks',
  'src/utils',
  'src/types',
  'src/constants',
  'src/assets',
  'public',
  'tests',
  'config'
];

let allExist = true;
requiredPaths.forEach(pathToCheck => {
  const fullPath = path.join(process.cwd(), pathToCheck);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ ${pathToCheck}`);
  } else {
    console.log(`  ❌ ${pathToCheck} - 見つかりません`);
    allExist = false;
  }
});

// ========================================
// 完了メッセージ
// ========================================
if (allExist) {
  console.log('\n✅ すべてのディレクトリとファイルが正常に作成されました！');
} else {
  console.log('\n⚠️ 一部のファイルが作成されませんでした。');
}

console.log('\n📊 作成完了したプロジェクト構造:');
console.log(`
tokaido-app/
├── src/
│   ├── components/        ✅
│   ├── services/         ✅
│   ├── store/            ✅
│   ├── hooks/            ✅
│   ├── utils/            ✅
│   ├── types/            ✅
│   ├── constants/        ✅
│   ├── assets/           ✅
│   └── App.tsx           ✅
├── public/               ✅
├── tests/                ✅
├── config/               ✅
├── scripts/              ✅
└── 各種設定ファイル        ✅
`);

console.log('\n🚀 次のステップ:');
console.log('1. npm install または docker-compose build');
console.log('2. npm run dev または make up');
console.log('3. http://localhost:5173 でアプリケーションにアクセス');