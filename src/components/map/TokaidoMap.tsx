import React, { useEffect, useRef } from 'react';
import useAppStore from '../../store/useAppStore';
import tokaidoData from '../../assets/data/tokaidoFullData.json';

const TokaidoMap: React.FC = () => {
  const { currentStationId } = useAppStore();
  const mapRef = useRef<SVGSVGElement>(null);
  
  // 緯度経度を地図座標に変換
  const latLngToXY = (lat: number, lng: number) => {
    // 日本橋から京都までの範囲（おおよそ）
    const minLng = 135.0; // 京都付近
    const maxLng = 139.8; // 東京付近
    const minLat = 34.8;
    const maxLat = 35.7;
    
    const x = ((lng - minLng) / (maxLng - minLng)) * 800;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 400;
    
    return { x, y };
  };
  
  // 現在の宿場にスクロール
  useEffect(() => {
    if (currentStationId !== null && mapRef.current) {
      const stationElement = document.getElementById(`map-station-${currentStationId}`);
      if (stationElement) {
        stationElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }
  }, [currentStationId]);
  
  return (
    <div className="w-full h-full bg-blue-50 overflow-auto p-4">
      <svg 
        ref={mapRef}
        width="850" 
        height="450" 
        viewBox="0 0 850 450"
        className="bg-white rounded shadow-lg"
      >
        {/* 背景グリッド */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="850" height="450" fill="url(#grid)" />
        
        {/* 海岸線（簡易版） */}
        <path
          d="M 0 250 Q 200 220 400 230 T 800 240 L 800 450 L 0 450 Z"
          fill="#e0f2fe"
          opacity="0.3"
        />
        
        {/* 東海道のルート */}
        <polyline
          points={tokaidoData.stations.map(station => {
            const { x, y } = latLngToXY(station.lat, station.lng);
            return `${x},${y}`;
          }).join(' ')}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeDasharray="5,3"
        />
        
        {/* 各宿場 */}
        {tokaidoData.stations.map((station) => {
          const { x, y } = latLngToXY(station.lat, station.lng);
          const isActive = station.id === currentStationId;
          const isStartEnd = station.id === 0 || station.id === 54;
          
          return (
            <g key={station.id} id={`map-station-${station.id}`}>
              {/* 宿場の円 */}
              <circle
                cx={x}
                cy={y}
                r={isActive ? 12 : (isStartEnd ? 8 : 6)}
                fill={isActive ? '#ef4444' : (isStartEnd ? '#3b82f6' : '#64748b')}
                stroke="white"
                strokeWidth="2"
                className={isActive ? 'animate-pulse' : ''}
              />
              
              {/* 宿場名（重要な宿場のみ表示） */}
              {(isActive || isStartEnd || station.id % 5 === 0) && (
                <text
                  x={x}
                  y={y - 15}
                  textAnchor="middle"
                  fontSize={isActive ? "14" : "11"}
                  fontWeight={isActive ? "bold" : "normal"}
                  fill={isActive ? '#ef4444' : '#1f2937'}
                  className={isActive ? 'animate-pulse' : ''}
                >
                  {station.name}
                </text>
              )}
              
              {/* ツールチップ用の透明な大きめの円 */}
              <circle
                cx={x}
                cy={y}
                r="20"
                fill="transparent"
                className="cursor-pointer hover:fill-yellow-200 hover:opacity-30"
              >
                <title>{`${station.name}（${station.modernName}）`}</title>
              </circle>
            </g>
          );
        })}
        
        {/* 凡例 */}
        <g transform="translate(20, 20)">
          <rect x="0" y="0" width="120" height="80" fill="white" stroke="#e5e7eb" rx="5" opacity="0.9"/>
          <text x="10" y="20" fontSize="12" fontWeight="bold">凡例</text>
          <circle cx="20" cy="35" r="6" fill="#64748b"/>
          <text x="30" y="39" fontSize="11">宿場</text>
          <circle cx="20" cy="50" r="8" fill="#3b82f6"/>
          <text x="30" y="54" fontSize="11">起点/終点</text>
          <circle cx="20" cy="65" r="10" fill="#ef4444"/>
          <text x="30" y="69" fontSize="11">現在位置</text>
        </g>
        
        {/* 方角 */}
        <g transform="translate(780, 20)">
          <text x="0" y="0" fontSize="16" fontWeight="bold" fill="#374151">東 →</text>
          <text x="0" y="400" fontSize="16" fontWeight="bold" fill="#374151">← 西</text>
        </g>
      </svg>
    </div>
  );
};

export default TokaidoMap;