// src/components/audio/AudioView.tsx
import React from 'react';
import AudioRecorder from './AudioRecorder';
import SyncRecorder from './SyncRecorder';
import AudioPlayer from './AudioPlayer';

const AudioView: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <AudioRecorder />
      </div>
      
      <SyncRecorder />
      
      <div className="border-t">
        <AudioPlayer />
      </div>
    </div>
  );
};

export default AudioView;