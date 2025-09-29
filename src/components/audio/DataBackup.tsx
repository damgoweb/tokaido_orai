import React, { useState } from 'react';
import StorageService from '../../services/storage/StorageService';

const DataBackup: React.FC = () => {
  const [lastBackup, setLastBackup] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // 設定と同期データのみエクスポート（音声ファイルは除外）
  const exportSettingsOnly = async () => {
    setIsProcessing(true);
    try {
      // 同期データ
      const syncData = localStorage.getItem('tokaido_sync_data');
      
      // アプリ設定
      const settings = localStorage.getItem('tokaido-app-storage');
      
      // 録音のメタデータのみ（音声データは含まない）
      const recordings = await StorageService.getAllRecordings();
      const recordingsMetadata = recordings.map(rec => ({
        name: rec.name,
        duration: rec.duration,
        createdAt: rec.createdAt,
        size: rec.blob.size
      }));

      const backupData = {
        version: '2.0',
        type: 'settings_only',
        date: new Date().toISOString(),
        recordingsMetadata: recordingsMetadata,
        syncData: syncData ? JSON.parse(syncData) : null,
        settings: settings ? JSON.parse(settings) : null,
        recordingsCount: recordingsMetadata.length,
        syncPointsCount: syncData ? JSON.parse(syncData).length : 0
      };

      // ファイルとしてダウンロード（軽量）
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tokaido_settings_${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setLastBackup(new Date().toLocaleString('ja-JP'));
      alert(`設定をバックアップしました（音声ファイルは含まれません）\nファイルサイズ: ${(blob.size / 1024).toFixed(1)}KB`);
    } catch (error) {
      console.error('Backup failed:', error);
      alert('バックアップに失敗しました');
    }
    setIsProcessing(false);
  };

  // 設定と同期データのみインポート
  const importSettingsOnly = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const text = await file.text();
      const backupData = JSON.parse(text);

      if (!confirm(`設定データをインポートします：\n同期: ${backupData.syncPointsCount || 0}点\n\n続けますか？`)) {
        setIsProcessing(false);
        return;
      }

      // 同期データを復元
      if (backupData.syncData) {
        localStorage.setItem('tokaido_sync_data', JSON.stringify(backupData.syncData));
      }

      // 設定を復元
      if (backupData.settings) {
        localStorage.setItem('tokaido-app-storage', JSON.stringify(backupData.settings));
      }

      alert('設定データを復元しました');
      window.location.reload();
    } catch (error) {
      console.error('Import failed:', error);
      alert('インポートに失敗しました');
    }
    setIsProcessing(false);
    event.target.value = '';
  };

  return (
    <div className="p-3 bg-blue-50 border-t">
      <div className="text-sm font-bold mb-2">データ管理</div>
      
      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            onClick={exportSettingsOnly}
            disabled={isProcessing}
            className="px-3 py-1 bg-blue-500 text-white rounded text-xs disabled:opacity-50"
          >
            設定をバックアップ
          </button>
          
          <label className={`px-3 py-1 bg-green-500 text-white rounded text-xs cursor-pointer ${isProcessing ? 'opacity-50' : ''}`}>
            設定を復元
            <input
              type="file"
              accept=".json"
              onChange={importSettingsOnly}
              disabled={isProcessing}
              className="hidden"
            />
          </label>
        </div>
        
        <div className="text-xs text-gray-600">
          ※音声ファイルは録音画面の「DL」ボタンで個別保存
        </div>
      </div>
      
      {lastBackup && (
        <div className="text-xs text-gray-600 mt-2">
          最終: {lastBackup}
        </div>
      )}
    </div>
  );
};

export default DataBackup;