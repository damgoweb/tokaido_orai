// src/services/sync/SyncService.ts
import IndexedDBService from '../storage/IndexedDBService';

interface SyncPoint {
  time: number;
  segmentId: string;
}

class SyncService {
  private syncPoints: SyncPoint[] = [];
  private isInitialized = false;
  
  /**
   * IndexedDBから同期ポイントを読み込む
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      const points = await IndexedDBService.getAllSyncPoints();
      this.syncPoints = points.map(p => ({
        time: p.time,
        segmentId: p.segmentId
      }));
      
      this.isInitialized = true;
      console.log(`同期ポイントを読み込みました: ${this.syncPoints.length}件`);
    } catch (error) {
      console.error('同期ポイントの読み込みに失敗:', error);
      this.syncPoints = [];
    }
  }
  
  /**
   * 同期ポイントを設定（手動設定用）
   */
  async setSyncPoint(segmentId: string, time: number): Promise<void> {
    const existingIndex = this.syncPoints.findIndex(p => p.segmentId === segmentId);
    
    if (existingIndex >= 0) {
      this.syncPoints[existingIndex].time = time;
    } else {
      this.syncPoints.push({ segmentId, time });
    }
    
    this.syncPoints.sort((a, b) => a.time - b.time);
    
    // IndexedDBに保存
    await IndexedDBService.saveSyncPoints(this.syncPoints);
  }
  
  /**
   * 現在の再生時間から対応するセグメントIDを取得
   */
  getSegmentByTime(currentTime: number): string | null {
    if (!this.isInitialized || this.syncPoints.length === 0) {
      return null;
    }
    
    // 現在時間に最も近い同期ポイントを探す
    for (let i = 0; i < this.syncPoints.length; i++) {
      const current = this.syncPoints[i];
      const next = this.syncPoints[i + 1];
      
      if (currentTime >= current.time && (!next || currentTime < next.time)) {
        return current.segmentId;
      }
    }
    
    // どのポイントにも該当しない場合は最後のセグメントを返す
    return this.syncPoints.length > 0 
      ? this.syncPoints[this.syncPoints.length - 1].segmentId 
      : null;
  }
  
  /**
   * セグメントIDから対応する時間を取得
   */
  getTimeBySegment(segmentId: string): number | null {
    const point = this.syncPoints.find(p => p.segmentId === segmentId);
    return point ? point.time : null;
  }
  
  /**
   * デフォルトの同期ポイントを生成（均等分割）
   */
  async generateDefaultSync(totalDuration: number, segmentCount: number = 58): Promise<void> {
    const segmentDuration = totalDuration / segmentCount;
    const points: SyncPoint[] = [];
    
    for (let i = 0; i < segmentCount; i++) {
      const segmentId = `seg_${String(i + 1).padStart(3, '0')}`;
      const time = i * segmentDuration;
      
      points.push({ segmentId, time });
    }
    
    this.syncPoints = points;
    await IndexedDBService.saveSyncPoints(points);
    this.isInitialized = true;
    
    console.log(`デフォルトの同期ポイントを生成しました: ${segmentCount}件`);
  }
  
  /**
   * すべての同期ポイントを取得
   */
  getSyncPoints(): SyncPoint[] {
    return [...this.syncPoints];
  }
  
  /**
   * 同期ポイントをクリア
   */
  async clearSyncPoints(): Promise<void> {
    this.syncPoints = [];
    this.isInitialized = false;
  }
  
  /**
   * 初期化状態を確認
   */
  getInitializationStatus(): boolean {
    return this.isInitialized;
  }
}

export default new SyncService();