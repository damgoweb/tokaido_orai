// src/services/storage/IndexedDBService.ts
import Dexie, { Table } from 'dexie';

interface Recording {
  id?: number;
  name: string;
  blob: Blob;
  duration: number;
  createdAt: Date;
  size?: number;
}

interface SyncPoint {
  id?: number;
  time: number;
  segmentId: string;
}

interface AppSettings {
  id?: number;
  key: string;
  value: any;
}

class TokaidoDatabase extends Dexie {
  recordings!: Table<Recording>;
  syncPoints!: Table<SyncPoint>;
  settings!: Table<AppSettings>;

  constructor() {
    super('TokaidoAppDB');
    
    this.version(1).stores({
      recordings: '++id, name, createdAt',
      syncPoints: '++id, time, segmentId',
      settings: '++id, key'
    });
  }
}

class IndexedDBService {
  private db: TokaidoDatabase;

  constructor() {
    this.db = new TokaidoDatabase();
  }

  // ==================== 録音データ関連 ====================

  /**
   * 録音データを保存
   */
  async saveRecording(recording: Omit<Recording, 'id'>): Promise<number> {
    try {
      const id = (await this.db.recordings.add(recording)) as number;
      return id;
    } catch (error) {
      console.error('録音データの保存に失敗:', error);
      throw error;
    }
  }

  /**
   * すべての録音データを取得
   */
  async getAllRecordings(): Promise<Recording[]> {
    try {
      return await this.db.recordings.toArray();
    } catch (error) {
      console.error('録音データの取得に失敗:', error);
      return [];
    }
  }

  /**
   * 名前で録音データを取得
   */
  async getRecordingByName(name: string): Promise<Recording | undefined> {
    try {
      return await this.db.recordings.where('name').equals(name).first();
    } catch (error) {
      console.error('録音データの取得に失敗:', error);
      return undefined;
    }
  }

  /**
   * 録音データを削除
   */
  async deleteRecording(id: number): Promise<void> {
    try {
      await this.db.recordings.delete(id);
    } catch (error) {
      console.error('録音データの削除に失敗:', error);
      throw error;
    }
  }

  /**
   * すべての録音データを削除
   */
  async clearAllRecordings(): Promise<void> {
    try {
      await this.db.recordings.clear();
    } catch (error) {
      console.error('録音データのクリアに失敗:', error);
      throw error;
    }
  }

  // ==================== 同期ポイント関連 ====================

  /**
   * 同期ポイントを一括保存（既存データをクリア）
   */
  async saveSyncPoints(syncPoints: Array<{ time: number; segmentId: string }>): Promise<void> {
    try {
      await this.db.transaction('rw', this.db.syncPoints, async () => {
        await this.db.syncPoints.clear();
        await this.db.syncPoints.bulkAdd(syncPoints);
      });
    } catch (error) {
      console.error('同期ポイントの保存に失敗:', error);
      throw error;
    }
  }

  /**
   * すべての同期ポイントを取得
   */
  async getAllSyncPoints(): Promise<SyncPoint[]> {
    try {
      return await this.db.syncPoints.orderBy('time').toArray();
    } catch (error) {
      console.error('同期ポイントの取得に失敗:', error);
      return [];
    }
  }

  /**
   * 時間から対応するセグメントIDを取得
   */
  async getSegmentByTime(time: number): Promise<string | null> {
    try {
      const syncPoints = await this.db.syncPoints.orderBy('time').toArray();
      
      for (let i = 0; i < syncPoints.length; i++) {
        const current = syncPoints[i];
        const next = syncPoints[i + 1];
        
        if (time >= current.time && (!next || time < next.time)) {
          return current.segmentId;
        }
      }
      
      return syncPoints.length > 0 ? syncPoints[syncPoints.length - 1].segmentId : null;
    } catch (error) {
      console.error('セグメント検索に失敗:', error);
      return null;
    }
  }

  /**
   * セグメントIDから時間を取得
   */
  async getTimeBySegment(segmentId: string): Promise<number | null> {
    try {
      const syncPoint = await this.db.syncPoints.where('segmentId').equals(segmentId).first();
      return syncPoint ? syncPoint.time : null;
    } catch (error) {
      console.error('時間の取得に失敗:', error);
      return null;
    }
  }

  // ==================== 設定関連 ====================

  /**
   * 設定を保存
   */
  async saveSetting(key: string, value: any): Promise<void> {
    try {
      const existing = await this.db.settings.where('key').equals(key).first();
      
      if (existing) {
        await this.db.settings.update(existing.id!, { value });
      } else {
        await this.db.settings.add({ key, value });
      }
    } catch (error) {
      console.error('設定の保存に失敗:', error);
      throw error;
    }
  }

  /**
   * 設定を取得
   */
  async getSetting(key: string): Promise<any> {
    try {
      const setting = await this.db.settings.where('key').equals(key).first();
      return setting ? setting.value : null;
    } catch (error) {
      console.error('設定の取得に失敗:', error);
      return null;
    }
  }

  // ==================== データ初期化チェック ====================

  /**
   * データが既に存在するかチェック
   */
  async hasInitialData(): Promise<boolean> {
    try {
      const [recordings, syncPoints] = await Promise.all([
        this.db.recordings.count(),
        this.db.syncPoints.count()
      ]);
      
      return recordings > 0 && syncPoints > 0;
    } catch (error) {
      console.error('データ存在チェックに失敗:', error);
      return false;
    }
  }

  /**
   * 初期データを一括保存（Vercel Blobから取得したデータ用）
   */
  async saveInitialData(audioBlob: Blob, settingsData: any): Promise<void> {
    try {
      await this.db.transaction('rw', [this.db.recordings, this.db.syncPoints, this.db.settings], async () => {
        // 録音データを保存
        if (settingsData.recordingsMetadata && settingsData.recordingsMetadata.length > 0) {
          const metadata = settingsData.recordingsMetadata[0];
          await this.db.recordings.add({
            name: metadata.name,
            blob: audioBlob,
            duration: metadata.duration || 0,
            createdAt: new Date(metadata.createdAt),
            size: metadata.size
          });
        }

        // 同期ポイントを保存
        if (settingsData.syncData && settingsData.syncData.length > 0) {
          await this.db.syncPoints.bulkAdd(settingsData.syncData);
        }

        // UI設定を保存
        if (settingsData.settings && settingsData.settings.state) {
          await this.saveSetting('appState', settingsData.settings.state);
        }
      });

      console.log('初期データの保存が完了しました');
    } catch (error) {
      console.error('初期データの保存に失敗:', error);
      throw error;
    }
  }

  /**
   * すべてのデータをクリア
   */
  async clearAllData(): Promise<void> {
    try {
      await this.db.transaction('rw', [this.db.recordings, this.db.syncPoints, this.db.settings], async () => {
        await this.db.recordings.clear();
        await this.db.syncPoints.clear();
        await this.db.settings.clear();
      });
      console.log('すべてのデータをクリアしました');
    } catch (error) {
      console.error('データのクリアに失敗:', error);
      throw error;
    }
  }
}

export default new IndexedDBService();