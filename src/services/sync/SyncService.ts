interface SyncPoint {
  segmentId: string;
  stationId: number;
  startTime: number;
  endTime: number;
}

class SyncService {
  private syncPoints: SyncPoint[] = [];
  
  setSyncPoint(segmentId: string, stationId: number, startTime: number, endTime: number) {
    const existingIndex = this.syncPoints.findIndex(p => p.segmentId === segmentId);
    
    if (existingIndex >= 0) {
      this.syncPoints[existingIndex] = { segmentId, stationId, startTime, endTime };
    } else {
      this.syncPoints.push({ segmentId, stationId, startTime, endTime });
    }
    
    this.syncPoints.sort((a, b) => a.startTime - b.startTime);
  }
  
  getSegmentByTime(currentTime: number): { segmentId: string; stationId: number } | null {
    const point = this.syncPoints.find(
      p => currentTime >= p.startTime && currentTime <= p.endTime
    );
    
    return point ? { segmentId: point.segmentId, stationId: point.stationId } : null;
  }
  
  generateDefaultSync(totalDuration: number): void {
    const segmentDuration = totalDuration / 58;
    
    for (let i = 0; i < 58; i++) {
      const segmentId = `seg_${String(i + 1).padStart(3, '0')}`;
      const stationId = this.getStationIdFromSegmentIndex(i);
      const startTime = i * segmentDuration;
      const endTime = (i + 1) * segmentDuration;
      
      this.syncPoints.push({
        segmentId,
        stationId,
        startTime,
        endTime
      });
    }
  }
  
  private getStationIdFromSegmentIndex(index: number): number {
    if (index < 2) return 0;
    if (index > 54) return 54;
    return Math.floor((index - 2) * 53 / 54) + 1;
  }
  
  getSyncPoints(): SyncPoint[] {
    return this.syncPoints;
  }
  
  clearSyncPoints(): void {
    this.syncPoints = [];
  }
}

export default new SyncService();