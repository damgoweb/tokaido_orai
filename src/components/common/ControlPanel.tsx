import React from 'react';
import useAppStore from '../../store/useAppStore';

export const ControlPanel: React.FC = () => {
  const { isPlaying, audioURL, setPlaying } = useAppStore();

  const handlePlay = () => {
    if (!audioURL) {
      alert('録音データがありません');
      return;
    }
    
    const audio = document.getElementById('main-audio') as HTMLAudioElement;
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setPlaying(false);
      } else {
        audio.play()
          .then(() => setPlaying(true))
          .catch(error => {
            console.error('再生エラー:', error);
            alert('再生に失敗しました');
          });
      }
    } else {
      alert('オーディオ要素が見つかりません');
    }
  };

  const handleStop = () => {
    const audio = document.getElementById('main-audio') as HTMLAudioElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={handlePlay}
        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
        disabled={!audioURL}
      >
        {isPlaying ? '一時停止' : '再生'}
      </button>
      <button 
        onClick={handleStop}
        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
        disabled={!audioURL}
      >
        停止
      </button>
    </div>
  );
};

export default ControlPanel;