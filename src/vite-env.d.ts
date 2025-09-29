/// <reference types="vite/client" />

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
