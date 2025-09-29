import React from 'react';
import AudioRecorder from './AudioRecorder';
import SyncRecorder from './SyncRecorder';
import DataBackup from './DataBackup';
import AudioPlayer from './AudioPlayer';

const AudioView: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <AudioRecorder />
      </div>
      
      <SyncRecorder />
      <DataBackup />
      
      <div className="border-t">
        <AudioPlayer />
      </div>
    </div>
  );
};

export default AudioView;