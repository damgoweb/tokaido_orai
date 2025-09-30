import React, { useEffect, useState } from 'react';
import useAppStore from '../../store/useAppStore';
import tokaidoData from '../../assets/data/tokaidoFullData.json';

const TokaidoUkiyoe: React.FC = () => {
  const { currentStationId } = useAppStore();
  const [currentImage, setCurrentImage] = useState<string>('');
  const [imageError, setImageError] = useState(false);
  
  // 浮世絵画像のパス設定（romaNameを使用）
  useEffect(() => {
    if (currentStationId !== null) {
      const station = tokaidoData.stations.find(s => s.id === currentStationId);
      if (station) {
        const imageNumber = String(station.id).padStart(2, '0');
        const imagePath = `/images/ukiyoe/${imageNumber}_${station.romaName}.jpg`;
        
        setCurrentImage(imagePath);
        setImageError(false);
      }
    } else {
      // 初期画像として日本橋を表示
      setCurrentImage('/images/ukiyoe/00_nihonbashi.jpg');
    }
  }, [currentStationId]);
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  const currentStation = tokaidoData.stations.find(s => s.id === currentStationId);
  
  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      {/* 上部情報バー */}
      <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">
            歌川広重 東海道五十三次
          </h3>
        </div>
        <div className="text-right">
          {currentStation && (
            <>
              <div className="text-xl font-bold">
                {currentStation.name}
              </div>
              <div className="text-sm text-gray-300">
                {currentStation.modernName}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* 浮世絵表示エリア */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-gray-800 to-gray-900">
        {imageError ? (
          <div className="text-center text-white">
            <div className="mb-4 text-6xl">🖼️</div>
            <h3 className="text-xl mb-2">浮世絵画像を配置してください</h3>
            <div className="text-sm text-gray-400">
              <p>public/images/ukiyoe/ フォルダに以下の形式で配置:</p>
              <p className="mt-2 font-mono">
                00_nihonbashi.jpg<br/>
                01_shinagawa.jpg<br/>
                02_kawasaki.jpg<br/>
                03_kanagawa.jpg<br/>
                04_hodogaya.jpg<br/>
                ...
              </p>
              <p className="mt-3 text-xs">
                ※ romaName形式でファイル名を設定してください
              </p>
            </div>
          </div>
        ) : (
          <div className="relative max-w-full max-h-full">
            <img
              src={currentImage}
              alt={currentStation ? `${currentStation.name}の浮世絵` : '東海道五十三次'}
              onError={handleImageError}
              className="max-w-full max-h-full object-contain shadow-2xl rounded"
              style={{ maxHeight: 'calc(100vh - 200px)' }}
            />
            
            {/* 画像の枠装飾 */}
            <div className="absolute inset-0 pointer-events-none border-8 border-gray-700 rounded shadow-inner"></div>
          </div>
        )}
      </div>
      
      {/* 下部ナビゲーション */}
      <div className="bg-gray-800 p-2">
        <div className="flex justify-center items-center gap-1">
          {tokaidoData.stations.map((station) => (
            <div
              key={station.id}
              className={`
                w-2 h-2 rounded-full transition-all
                ${station.id === currentStationId 
                  ? 'bg-yellow-400 w-3 h-3' 
                  : 'bg-gray-600 hover:bg-gray-500'
                }
              `}
              title={station.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokaidoUkiyoe;