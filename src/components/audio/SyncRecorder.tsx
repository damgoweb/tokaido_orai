import React, { useState, useEffect } from 'react';
import tokaidoData from '../../assets/data/tokaidoFullData.json';

const SyncRecorder: React.FC = () => {
  const [syncPoints, setSyncPoints] = useState<Array<{time: number, segmentId: string}>>([]);
  const [isRecordingSync, setIsRecordingSync] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedDataCount, setSavedDataCount] = useState(0);
  
  // 初回のみデータを確認
  useEffect(() => {
    const data = localStorage.getItem('tokaido_sync_data');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setSavedDataCount(parsed.length);
      } catch (e) {
        console.error('同期データ読み込みエラー');
      }
    }
  }, []);
  
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
  
  const saveSyncData = () => {
    localStorage.setItem('tokaido_sync_data', JSON.stringify(syncPoints));
    setSavedDataCount(syncPoints.length);
    setIsRecordingSync(false);
    alert(`${syncPoints.length}個の同期ポイントを保存しました`);
    window.location.reload();
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
        <button
          onClick={startSyncRecording}
          className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
        >
          同期記録開始
        </button>
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