// src/components/audio/SyncRecorder.tsx
import React, { useState, useEffect } from 'react';
import IndexedDBService from '../../services/storage/IndexedDBService';
import tokaidoData from '../../assets/data/tokaidoFullData.json';

const SyncRecorder: React.FC = () => {
  const [syncPoints, setSyncPoints] = useState<Array<{time: number, segmentId: string}>>([]);
  const [isRecordingSync, setIsRecordingSync] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedDataCount, setSavedDataCount] = useState(0);
  
  // 初回のみデータを確認
  useEffect(() => {
    loadSyncCount();
  }, []);

  const loadSyncCount = async () => {
    try {
      const points = await IndexedDBService.getAllSyncPoints();
      setSavedDataCount(points.length);
    } catch (error) {
      console.error('同期データカウント取得エラー:', error);
    }
  };
  
  const startSyncRecording = () => {
    setIsRecordingSync(true);
    setSyncPoints([]);
    setCurrentIndex(0);
  };
  
  const recordNextPoint = () => {
    const audio = document.getElementById('main-audio') as HTMLAudioElement;
    if (!audio) {
      alert('音声が読み込まれていません');
      return;
    }
    
    if (currentIndex < tokaidoData.segments.length) {
      const segment = tokaidoData.segments[currentIndex];
      const newPoint = {
        time: audio.currentTime,
        segmentId: segment.id
      };
      
      const updatedPoints = [...syncPoints, newPoint];
      setSyncPoints(updatedPoints);
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const saveSyncData = async () => {
    try {
      await IndexedDBService.saveSyncPoints(syncPoints);
      setSavedDataCount(syncPoints.length);
      setIsRecordingSync(false);
      alert(`${syncPoints.length}個の同期ポイントを保存しました`);
      
      // ページをリロードして変更を反映
      window.location.reload();
    } catch (error) {
      console.error('同期データ保存エラー:', error);
      alert('保存に失敗しました');
    }
  };

  const exportSyncData = async () => {
    try {
      const points = await IndexedDBService.getAllSyncPoints();
      
      if (points.length === 0) {
        alert('エクスポートするデータがありません');
        return;
      }

      const recordings = await IndexedDBService.getAllRecordings();
      const recordingsMetadata = recordings.map(r => ({
        name: r.name,
        duration: r.duration,
        createdAt: r.createdAt,
        size: r.size || r.blob.size
      }));

      const exportData = {
        version: "2.0",
        type: "settings_only",
        date: new Date().toISOString(),
        recordingsMetadata,
        syncData: points,
        settings: {
          state: {
            displayMode: "horizontal",
            showRuby: true,
            fontSize: "medium"
          },
          version: 0
        },
        recordingsCount: recordings.length,
        syncPointsCount: points.length
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tokaido_settings_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      alert('設定をエクスポートしました');
    } catch (error) {
      console.error('エクスポートエラー:', error);
      alert('エクスポートに失敗しました');
    }
  };

  const importSyncData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.syncData && Array.isArray(data.syncData)) {
        await IndexedDBService.saveSyncPoints(data.syncData);
        setSavedDataCount(data.syncData.length);
        alert(`${data.syncData.length}個の同期ポイントをインポートしました`);
        window.location.reload();
      } else {
        alert('無効なファイル形式です');
      }
    } catch (error) {
      console.error('インポートエラー:', error);
      alert('インポートに失敗しました');
    }

    event.target.value = '';
  };
  
  const currentSegment = currentIndex < tokaidoData.segments.length 
    ? tokaidoData.segments[currentIndex] 
    : null;
    
  return (
    <div className="p-2 border-t bg-yellow-50">
      <div className="text-sm font-bold mb-2">
        手動同期 {savedDataCount > 0 && `(${savedDataCount}点保存済み)`}
      </div>
      
      {!isRecordingSync ? (
        <div className="space-y-1">
          <button
            onClick={startSyncRecording}
            className="w-full px-3 py-1 bg-blue-500 text-white rounded text-xs"
          >
            同期記録開始
          </button>
          <div className="flex gap-1">
            <button
              onClick={exportSyncData}
              className="flex-1 px-3 py-1 bg-green-500 text-white rounded text-xs"
            >
              設定をバックアップ
            </button>
            <label className="flex-1 px-3 py-1 bg-purple-500 text-white rounded text-xs cursor-pointer text-center">
              設定を復元
              <input
                type="file"
                accept=".json"
                onChange={importSyncData}
                className="hidden"
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="text-xs text-gray-600">
            【{currentSegment?.stationName}】
          </div>
          <div className="text-xs font-bold text-blue-800 p-1 bg-white rounded">
            次の本文: {currentSegment?.text ? 
              (currentSegment.text.length > 30 
                ? currentSegment.text.substring(0, 30) + '...' 
                : currentSegment.text)
              : ''}
          </div>
          <div className="flex gap-1">
            <button
              onClick={recordNextPoint}
              className="flex-1 px-3 py-1 bg-green-500 text-white rounded text-xs"
            >
              記録 ({currentIndex + 1}/{tokaidoData.segments.length})
            </button>
            <button
              onClick={saveSyncData}
              className="px-3 py-1 bg-orange-500 text-white rounded text-xs"
            >
              保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncRecorder;