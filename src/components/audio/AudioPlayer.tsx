import React, { useState, useEffect } from 'react';
import useAppStore from '../../store/useAppStore';
import tokaidoData from '../../assets/data/tokaidoFullData.json';

const AudioPlayer: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [syncMode, setSyncMode] = useState(false);
  const [syncData, setSyncData] = useState<Array<{time: number, segmentId: string}>>([]);
  
  const { 
    setCurrentSegment,
    setCurrentStation,
    setPlaying
  } = useAppStore();

  // 同期データを読み込み
  useEffect(() => {
    const savedData = localStorage.getItem('tokaido_sync_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setSyncData(parsed);
        console.log(`同期データ読み込み: ${parsed.length}点`);
      } catch (error) {
        console.error('同期データ読み込みエラー');
      }
    }
  }, []);

  // リアルタイム同期処理
  useEffect(() => {
    const audioElement = document.getElementById('main-audio') as HTMLAudioElement;
    if (!audioElement || !audioElement.src) return;

    const handleTimeUpdate = () => {
      const time = audioElement.currentTime;
      setCurrentTime(time);
      setDuration(audioElement.duration || 0);
      
      // 同期モード時は常に更新
      if (syncMode && syncData.length > 0) {
        let targetSegmentId = syncData[0].segmentId;
        let targetStationId = 0;
        
        // 現在時間に対応するセグメントを探す
        for (let i = 0; i < syncData.length; i++) {
          if (i === syncData.length - 1 || time < syncData[i + 1].time) {
            targetSegmentId = syncData[i].segmentId;
            break;
          }
        }
        
        // セグメントから宿場を特定
        const segment = tokaidoData.segments.find(s => s.id === targetSegmentId);
        if (segment) {
          targetStationId = segment.stationId;
          
          // 確実にステートを更新
          setCurrentSegment(targetSegmentId);
          setCurrentStation(targetStationId);
          
          // デバッグ用（1秒ごとにログ出力）
          if (Math.floor(time) !== Math.floor(time - 0.1)) {
            console.log(`同期: ${time.toFixed(1)}秒 → ${segment.stationName} / ${targetSegmentId}`);
          }
        }
      }
    };

    const handlePlay = () => {
      setPlaying(true);
      console.log('再生開始 - 同期モード:', syncMode);
    };

    const handlePause = () => {
      setPlaying(false);
      console.log('一時停止');
    };

    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration);
    };

    // イベントリスナー登録
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    // 初期値設定
    if (audioElement.duration) {
      handleLoadedMetadata();
    }
    
    // クリーンアップ
    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [syncMode, syncData, setCurrentSegment, setCurrentStation, setPlaying]);
  
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audioElement = document.getElementById('main-audio') as HTMLAudioElement;
    if (audioElement) {
      const newTime = parseFloat(e.target.value);
      audioElement.currentTime = newTime;
      setCurrentTime(newTime);
      
      // シーク時も同期を更新
      if (syncMode && syncData.length > 0) {
        let targetSegmentId = syncData[0].segmentId;
        for (let i = 0; i < syncData.length; i++) {
          if (i === syncData.length - 1 || newTime < syncData[i + 1].time) {
            targetSegmentId = syncData[i].segmentId;
            break;
          }
        }
        const segment = tokaidoData.segments.find(s => s.id === targetSegmentId);
        if (segment) {
          setCurrentSegment(targetSegmentId);
          setCurrentStation(segment.stationId);
        }
      }
    }
  };
  
  const toggleSync = () => {
    const newMode = !syncMode;
    setSyncMode(newMode);
    console.log(newMode ? '同期ON - データ数:' + syncData.length : '同期OFF');
    
    if (!newMode) {
      // 同期OFF時はリセット
      setCurrentSegment('');
      setCurrentStation(0);
    } else {
      // 同期ON時は現在位置を即座に反映
      const audioElement = document.getElementById('main-audio') as HTMLAudioElement;
      if (audioElement && syncData.length > 0) {
        const time = audioElement.currentTime;
        let targetSegmentId = syncData[0].segmentId;
        for (let i = 0; i < syncData.length; i++) {
          if (i === syncData.length - 1 || time < syncData[i + 1].time) {
            targetSegmentId = syncData[i].segmentId;
            break;
          }
        }
        const segment = tokaidoData.segments.find(s => s.id === targetSegmentId);
        if (segment) {
          setCurrentSegment(targetSegmentId);
          setCurrentStation(segment.stationId);
        }
      }
    }
  };
  
  const clearSyncData = () => {
    if (confirm('同期データを削除しますか？')) {
      localStorage.removeItem('tokaido_sync_data');
      setSyncData([]);
      setSyncMode(false);
      window.location.reload();
    }
  };
  
  return (
    <div className="p-4 border-t bg-gray-50">
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{formatTime(currentTime)}</span>
          <div className="flex gap-2">
            {syncData.length > 0 ? (
              <>
                <button
                  onClick={toggleSync}
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    syncMode 
                      ? 'bg-green-500 text-white animate-pulse' 
                      : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {syncMode ? '🔄 同期ON' : '同期OFF'} ({syncData.length}点)
                </button>
                <button
                  onClick={clearSyncData}
                  className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                >
                  削除
                </button>
              </>
            ) : (
              <span className="text-orange-600">⚠ 同期データなし</span>
            )}
          </div>
          <span>{formatTime(duration)}</span>
        </div>
        
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        
        {syncMode && (
          <div className="mt-1 text-xs text-green-600">
            同期中: {formatTime(currentTime)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;