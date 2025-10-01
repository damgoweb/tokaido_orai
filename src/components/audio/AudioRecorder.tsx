// src/components/audio/AudioRecorder.tsx
import React, { useState, useRef, useEffect } from 'react';
import IndexedDBService from '../../services/storage/IndexedDBService';
import useAppStore from '../../store/useAppStore';

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string>('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [savedRecordings, setSavedRecordings] = useState<any[]>([]);
  
  const { setAudioURL: setGlobalAudioURL } = useAppStore();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadRecordings();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const loadRecordings = async () => {
    try {
      const recordings = await IndexedDBService.getAllRecordings();
      setSavedRecordings(recordings);
      
      if (recordings.length > 0) {
        const latest = recordings[recordings.length - 1];
        const url = URL.createObjectURL(latest.blob);
        setAudioURL(url);
        setGlobalAudioURL(url);
        setAudioBlob(latest.blob);
      }
    } catch (error) {
      console.error('録音データの読み込みに失敗:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setRecordingTime(0);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setGlobalAudioURL(url);
        setAudioBlob(audioBlob);
        
        const name = `録音_${new Date().toLocaleString('ja-JP').replace(/[/:]/g, '-')}`;
        
        await IndexedDBService.saveRecording({
          name,
          blob: audioBlob,
          duration: recordingTime,
          createdAt: new Date(),
          size: audioBlob.size
        });
        
        await loadRecordings();
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      alert('マイクへのアクセスを許可してください');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const downloadRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tokaido_${new Date().getTime()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const importRecording = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const name = file.name.replace(/\.(webm|wav|mp3|ogg)$/i, '');
      const blob = new Blob([await file.arrayBuffer()], { type: file.type });
      
      await IndexedDBService.saveRecording({
        name,
        blob,
        duration: 0,
        createdAt: new Date(),
        size: blob.size
      });
      
      await loadRecordings();
      
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      setGlobalAudioURL(url);
      setAudioBlob(blob);
      
      alert('録音データをインポートしました');
    } catch (error) {
      alert('インポートに失敗しました');
    }
    
    event.target.value = '';
  };

  const loadRecording = async (recording: any) => {
    const url = URL.createObjectURL(recording.blob);
    setAudioURL(url);
    setGlobalAudioURL(url);
    setAudioBlob(recording.blob);
  };

  const deleteRecording = async (id: number) => {
    if (confirm('削除しますか？')) {
      await IndexedDBService.deleteRecording(id);
      await loadRecordings();
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">録音状態</div>
        <div className="text-2xl font-mono">
          {formatTime(recordingTime)}
        </div>
      </div>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 text-white rounded ${
            isRecording 
              ? 'bg-red-500 animate-pulse' 
              : 'bg-blue-500'
          }`}
        >
          {isRecording ? '■ 停止' : '● 録音'}
        </button>
        
        {audioBlob && !isRecording && (
          <button
            onClick={downloadRecording}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            DL
          </button>
        )}
        
        <label className="px-4 py-2 bg-purple-500 text-white rounded cursor-pointer">
          インポート
          <input
            type="file"
            accept="audio/*"
            onChange={importRecording}
            className="hidden"
          />
        </label>
      </div>
      
      {audioURL && (
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">再生</div>
          <audio id="main-audio" controls src={audioURL} className="w-full" />
        </div>
      )}
      
      <div className="max-h-24 overflow-auto border-t pt-2">
        <div className="text-sm text-gray-600 mb-2">
          保存済み ({savedRecordings.length})
        </div>
        <div className="space-y-1">
          {savedRecordings.map((rec) => (
            <div key={rec.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
              <button
                onClick={() => loadRecording(rec)}
                className="flex-1 text-left"
              >
                {rec.name}
              </button>
              <button
                onClick={() => deleteRecording(rec.id)}
                className="text-red-500"
              >
                削除
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;