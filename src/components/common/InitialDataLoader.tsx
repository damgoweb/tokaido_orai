// src/components/common/InitialDataLoader.tsx
import React, { useEffect, useState } from 'react';
import BlobStorageService from '../../services/storage/BlobStorageService';
import IndexedDBService from '../../services/storage/IndexedDBService';

interface InitialDataLoaderProps {
  onLoadComplete: () => void;
  children: React.ReactNode;
}

type LoadingState = 'checking' | 'downloading' | 'saving' | 'complete' | 'error';

const InitialDataLoader: React.FC<InitialDataLoaderProps> = ({ onLoadComplete, children }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>('checking');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoadingState('checking');
      
      // 既にデータが存在するかチェック
      const hasData = await IndexedDBService.hasInitialData();
      
      if (hasData) {
        console.log('既存データが見つかりました');
        setLoadingState('complete');
        onLoadComplete();
        return;
      }

      console.log('初期データをダウンロードします...');
      setLoadingState('downloading');

      // Vercel Blobからデータをダウンロード
      const { audioBlob, settings } = await BlobStorageService.downloadAllData(
        (progressInfo: { loaded: number; total: number; percentage: number }) => {
          setProgress(progressInfo.percentage);
        }
      );

      setLoadingState('saving');
      setProgress(100);

      // IndexedDBに保存
      await IndexedDBService.saveInitialData(audioBlob, settings);

      setLoadingState('complete');
      onLoadComplete();
      
    } catch (error) {
      console.error('初期データの読み込みに失敗:', error);
      setLoadingState('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'データの読み込みに失敗しました'
      );
    }
  };

  const handleRetry = () => {
    setErrorMessage('');
    setProgress(0);
    initializeData();
  };

  const handleSkip = () => {
    setLoadingState('complete');
    onLoadComplete();
  };

  // データ読み込み完了後は子コンポーネントを表示
  if (loadingState === 'complete') {
    return <>{children}</>;
  }

  // ローディング画面
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            東海道往来
          </h1>
          <p className="text-gray-600 text-sm">
            インタラクティブ朗読アプリケーション
          </p>
        </div>

        {/* ローディングコンテンツ */}
        <div className="space-y-6">
          {/* エラー時 */}
          {loadingState === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm font-medium mb-1">
                  データの読み込みに失敗しました
                </p>
                <p className="text-red-600 text-xs">
                  {errorMessage}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  再試行
                </button>
                <button
                  onClick={handleSkip}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  スキップ
                </button>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                スキップした場合、後で手動でデータをインポートできます
              </p>
            </div>
          )}

          {/* ローディング時 */}
          {loadingState !== 'error' && (
            <>
              <div className="space-y-3">
                {/* ステータスメッセージ */}
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-700">
                    {loadingState === 'checking' && '初期化中...'}
                    {loadingState === 'downloading' && '音声データをダウンロード中...'}
                    {loadingState === 'saving' && 'データを保存中...'}
                  </p>
                  {loadingState === 'downloading' && (
                    <p className="text-sm text-gray-500 mt-1">
                      {progress}%
                    </p>
                  )}
                </div>

                {/* プログレスバー */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: `${loadingState === 'checking' ? 10 : loadingState === 'downloading' ? progress : 100}%`
                    }}
                  />
                </div>
              </div>

              {/* ローディングアニメーション */}
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500" />
              </div>

              {/* 情報メッセージ */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  初回起動時のみ、音声データと設定をダウンロードしています。
                  <br />
                  次回以降は素早く起動できます。
                </p>
              </div>
            </>
          )}
        </div>

        {/* フッター */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            データサイズ: 約2.5MB（音声データ）
          </p>
        </div>
      </div>
    </div>
  );
};

export default InitialDataLoader;