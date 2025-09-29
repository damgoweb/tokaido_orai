import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import tokaidoData from '../assets/data/tokaidoFullData.json';

interface AppState {
  currentSegmentId: string;
  currentSegment: typeof tokaidoData.segments[0] | null;
  displayMode: 'vertical' | 'horizontal';
  showRuby: boolean;
  fontSize: 'small' | 'medium' | 'large';
  isRecording: boolean;
  isPlaying: boolean;
  audioURL: string | null;
  recordingTime: number;
  currentStationId: number;
  currentStation: typeof tokaidoData.stations[0] | null;
  
  setCurrentSegment: (id: string) => void;
  setCurrentStation: (id: number) => void;
  setDisplayMode: (mode: 'vertical' | 'horizontal') => void;
  setShowRuby: (show: boolean) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setRecording: (recording: boolean) => void;
  setPlaying: (playing: boolean) => void;
  setAudioURL: (url: string | null) => void;
}

const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        currentSegmentId: 'seg_001',
        currentSegment: tokaidoData.segments[0],
        displayMode: 'horizontal',
        showRuby: true,
        fontSize: 'medium',
        isRecording: false,
        isPlaying: false,
        audioURL: null,
        recordingTime: 0,
        currentStationId: 0,
        currentStation: tokaidoData.stations[0],
        
        setCurrentSegment: (id) => {
          const segment = tokaidoData.segments.find(s => s.id === id);
          if (segment) {
            set({ 
              currentSegmentId: id,
              currentSegment: segment,
              currentStationId: segment.stationId,
              currentStation: tokaidoData.stations.find(st => st.id === segment.stationId) || null
            });
          }
        },
        
        setCurrentStation: (id) => {
          const station = tokaidoData.stations.find(s => s.id === id);
          if (station) {
            set({ 
              currentStationId: id,
              currentStation: station
            });
          }
        },
        
        setDisplayMode: (mode) => set({ displayMode: mode }),
        setShowRuby: (show) => set({ showRuby: show }),
        setFontSize: (size) => set({ fontSize: size }),
        setRecording: (recording) => set({ isRecording: recording }),
        setPlaying: (playing) => set({ isPlaying: playing }),
        setAudioURL: (url) => set({ audioURL: url }),
      }),
      {
        name: 'tokaido-app-storage',
        partialize: (state) => ({
          displayMode: state.displayMode,
          showRuby: state.showRuby,
          fontSize: state.fontSize
        })
      }
    )
  )
);

export default useAppStore;