class AudioService {
  // private mediaRecorder: MediaRecorder | null = null;
  // private audioContext: AudioContext | null = null;

  async startRecording(): Promise<void> {
    // 録音開始ロジック
  }

  async stopRecording(): Promise<Blob> {
    // 録音停止ロジック
    return new Blob();
  }
}

export default new AudioService();
