import Dexie, { Table } from 'dexie';

interface Recording {
  id?: number;
  name: string;
  blob: Blob;
  duration: number;
  createdAt: Date;
}

class TokaidoDB extends Dexie {
  recordings!: Table<Recording>;

  constructor() {
    super('TokaidoDB');
    this.version(1).stores({
      recordings: '++id, name, createdAt'
    });
  }
}

const db = new TokaidoDB();

export const StorageService = {
  async saveRecording(name: string, blob: Blob, duration: number): Promise<number> {
    const id = await db.recordings.add({
      name,
      blob,
      duration,
      createdAt: new Date()
    });
    // IndexableTypeをnumberにキャスト
    return Number(id);
  },

  async getAllRecordings(): Promise<Recording[]> {
    return await db.recordings.toArray();
  },

  async getRecording(id: number): Promise<Recording | undefined> {
    return await db.recordings.get(id);
  },

  async deleteRecording(id: number): Promise<void> {
    await db.recordings.delete(id);
  },

  async getLastRecording(): Promise<Recording | undefined> {
    const recordings = await db.recordings.orderBy('createdAt').reverse().limit(1).toArray();
    return recordings[0];
  }
};

export default StorageService;