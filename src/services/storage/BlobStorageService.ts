// src/services/storage/BlobStorageService.ts
// Vercel Blobからデフォルトデータをダウンロードするサービス

interface BlobUrls {
  audioUrl: string;
  settingsUrl: string;
}

interface DownloadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class BlobStorageService {
  private urls: BlobUrls = {
    audioUrl: 'https://ppbjx2gbkie88n2g.public.blob.vercel-storage.com/uploads/tokaido-recording.mp3',
    settingsUrl: 'https://ppbjx2gbkie88n2g.public.blob.vercel-storage.com/uploads/tokaido_settings.json'
  };

  /**
   * 音声データをダウンロード
   */
  async downloadAudio(
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<Blob> {
    try {
      const response = await fetch(this.urls.audioUrl);
      
      if (!response.ok) {
        throw new Error(`音声データのダウンロードに失敗しました: ${response.status}`);
      }

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      if (!response.body || !onProgress) {
        return await response.blob();
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let loaded = 0;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        loaded += value.length;
        
        if (onProgress && total > 0) {
          onProgress({
            loaded,
            total,
            percentage: Math.round((loaded / total) * 100)
          });
        }
      }

      return new Blob(chunks as BlobPart[], { type: 'audio/mpeg' });
    } catch (error) {
      console.error('音声ダウンロードエラー:', error);
      throw new Error('音声データのダウンロードに失敗しました');
    }
  }

  /**
   * 同期設定データをダウンロード
   */
  async downloadSettings(): Promise<any> {
    try {
      const response = await fetch(this.urls.settingsUrl);
      
      if (!response.ok) {
        throw new Error(`設定データのダウンロードに失敗しました: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('設定データダウンロードエラー:', error);
      throw new Error('設定データのダウンロードに失敗しました');
    }
  }

  /**
   * すべてのデータを一括ダウンロード
   */
  async downloadAllData(
    onAudioProgress?: (progress: DownloadProgress) => void
  ): Promise<{
    audioBlob: Blob;
    settings: any;
  }> {
    const [audioBlob, settings] = await Promise.all([
      this.downloadAudio(onAudioProgress),
      this.downloadSettings()
    ]);

    return { audioBlob, settings };
  }

  /**
   * Blob URLの有効性をチェック
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const response = await fetch(this.urls.settingsUrl, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export default new BlobStorageService();