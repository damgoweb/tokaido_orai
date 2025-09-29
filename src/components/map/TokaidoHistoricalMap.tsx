import React, { useEffect, useState } from 'react';
import useAppStore from '../../store/useAppStore';
import tokaidoData from '../../assets/data/tokaidoFullData.json';

const TokaidoHistoricalMap: React.FC = () => {
  const { currentStationId } = useAppStore();
  const [mapImage, setMapImage] = useState<string>('');
  
  // 画像の読み込み
  useEffect(() => {
    // デフォルト画像または実際の歴史地図画像のパス
    // public/images/tokaido-historical.jpg などに配置
    setMapImage('/images/tokaido-placeholder.jpg');
  }, []);
  
  // 各宿場の画像上の位置（パーセンテージ）
  // 実際の地図に合わせて調整が必要
  const stationPositions: { [key: number]: { x: number; y: number } } = {
    0: { x: 85, y: 50 },   // 日本橋
    1: { x: 82, y: 52 },   // 品川
    2: { x: 80, y: 53 },   // 川崎
    3: { x: 77, y: 54 },   // 神奈川
    4: { x: 74, y: 55 },   // 保土ヶ谷
    5: { x: 71, y: 56 },   // 戸塚
    6: { x: 68, y: 57 },   // 藤沢
    7: { x: 65, y: 58 },   // 平塚
    8: { x: 62, y: 58 },   // 大磯
    9: { x: 59, y: 57 },   // 小田原
    10: { x: 56, y: 56 },  // 箱根
    // ... 残りの宿場も同様に設定
    53: { x: 12, y: 48 },  // 大津
    54: { x: 10, y: 50 },  // 京都
  };
  
  // 簡易的な位置計算（緯度経度から推定）
  const getStationPosition = (stationId: number) => {
    if (stationPositions[stationId]) {
      return stationPositions[stationId];
    }
    
    // 位置が定義されていない場合は緯度経度から推定
    const station = tokaidoData.stations.find(s => s.id === stationId);
    if (station) {
      // 東海道の範囲: 東京(139.8) から 京都(135.7)
      const x = 85 - ((station.lng - 135.7) / (139.8 - 135.7)) * 75;
      const y = 50 + ((35.5 - station.lat) / 0.5) * 10;
      return { x, y };
    }
    return { x: 50, y: 50 };
  };
  
  return (
    <div className="w-full h-full relative bg-gray-100 overflow-hidden">
      {/* 歴史地図の背景 */}
      {mapImage ? (
        <img
          src={mapImage}
          alt="東海道古地図"
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-100">
          <div className="text-center p-8">
            <h3 className="text-xl font-bold mb-4">歴史地図表示エリア</h3>
            <p className="text-sm text-gray-600 mb-4">
              江戸時代の東海道地図画像を配置してください
            </p>
            <div className="text-xs text-gray-500">
              public/images/tokaido-historical.jpg
            </div>
          </div>
        </div>
      )}
      
      {/* 宿場マーカーのオーバーレイ */}
      <div className="absolute inset-0 pointer-events-none">
        {tokaidoData.stations.map((station) => {
          const isActive = station.id === currentStationId;
          const isStartEnd = station.id === 0 || station.id === 54;
          const position = getStationPosition(station.id);
          
          return (
            <div
              key={station.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
            >
              {/* アクティブな宿場の強調 */}
              {isActive && (
                <div className="absolute inset-0 -m-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full animate-ping opacity-30" />
                  <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse opacity-50 absolute top-1 left-1" />
                </div>
              )}
              
              {/* 宿場マーカー */}
              <div
                className={`
                  rounded-full border-2 border-white shadow-lg
                  ${isActive ? 'w-5 h-5 bg-red-500' : isStartEnd ? 'w-4 h-4 bg-blue-500' : 'w-3 h-3 bg-gray-700'}
                `}
              />
              
              {/* 宿場名（主要な場所のみ） */}
              {(isActive || isStartEnd) && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="bg-white px-2 py-1 rounded shadow-lg text-xs">
                    <div className="font-bold">{station.name}</div>
                    {isActive && (
                      <div className="text-gray-500 text-xs">{station.modernName}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* 情報パネル */}
      <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg max-w-xs">
        <h3 className="text-sm font-bold mb-2">東海道五十三次</h3>
        <div className="text-xs text-gray-600">
          {currentStationId !== null && (
            <>
              現在: <span className="font-bold text-red-600">
                {tokaidoData.stations.find(s => s.id === currentStationId)?.name}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokaidoHistoricalMap;