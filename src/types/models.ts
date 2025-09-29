export interface Station {
  id: number;
  name: string;
  historicalName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  modernCity: string;
  description?: string;
}

export interface TokaidoSegment {
  id: string;
  stationId: number;
  text: string;
  ruby?: string;
  startOffset: number;
  endOffset: number;
}

export interface Recording {
  id: string;
  title: string;
  blob: Blob;
  duration: number;
  format: string;
  createdAt: Date;
  updatedAt: Date;
}
