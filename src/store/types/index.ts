export interface AppState {
  textState: TextState;
  audioState: AudioState;
  mapState: MapState;
  actions: Actions;
}

export interface TextState {
  segments: any[];
  currentSegmentId: string | null;
  displayMode: 'vertical' | 'horizontal';
  fontSize: 'small' | 'medium' | 'large';
  showRuby: boolean;
}

export interface AudioState {
  isRecording: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
}

export interface MapState {
  currentStationId: number | null;
  zoomLevel: number;
  followMode: boolean;
}

export interface Actions {
  setCurrentSegment: (segmentId: string) => void;
}
