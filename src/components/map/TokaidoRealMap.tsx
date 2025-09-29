import React, { useEffect, useRef } from 'react';
import useAppStore from '../../store/useAppStore';
import tokaidoData from '../../assets/data/tokaidoFullData.json';

const TokaidoRealMap: React.FC = () => {
  const { currentStationId } = useAppStore();
  const svgRef = useRef<SVGSVGElement>(null);
  
  // 緯度経度の範囲を計算
  const lats = tokaidoData.stations.map(s => s.lat);
  const lngs = tokaidoData.stations.map(s => s.lng);
  const minLat = Math.min(...lats) - 0.1;
  const maxLat = Math.max(...lats) + 0.1;
  const minLng = Math.min(...lngs) - 0.1;
  const maxLng = Math.max(...lngs) + 0.1;
  
  // 緯度経度をSVG座標に変換
  const latLngToXY = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 900 + 50;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 500 + 50;
    return { x, y };
  };
  
  // 現在の宿場を中心に表示
  useEffect(() => {
    if (currentStationId !== null && svgRef.current) {
      const station = tokaidoData.stations.find(s => s.id === currentStationId);
      if (station) {
        const { x, y } = latLngToXY(station.lat, station.lng);
        
        // SVGの視点を移動（アニメーション付き）
        //const viewBox = svgRef.current.viewBox.baseVal; viewBox変数を削除して直接設定
        const targetX = Math.max(0, Math.min(x - 500, 0));
        const targetY = Math.max(0, Math.min(y - 300, 600 - 600));
        
        // スムーズスクロール
        svgRef.current.setAttribute('viewBox', `${targetX} ${targetY} 1000 600`);
      }
    }
  }, [currentStationId]);
  
  return (
    <div className="w-full h-full bg-gradient-to-b from-blue-50 to-green-50 p-4 overflow-hidden">
      <svg 
        ref={svgRef}
        width="100%" 
        height="100%"
        viewBox="0 0 1000 600"
        className="bg-white rounded-lg shadow-xl"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 背景グラデーション */}
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <rect width="1000" height="600" fill="url(#bgGrad)" />
        
        {/* 海岸線の表現 */}
        <path
          d={`M ${latLngToXY(35.7, 139.8).x} ${latLngToXY(35.7, 139.8).y + 100}
              Q ${latLngToXY(35.3, 138.5).x} ${latLngToXY(35.3, 138.5).y + 120}
                ${latLngToXY(34.9, 135.2).x} ${latLngToXY(34.9, 135.2).y + 100}
              L 1000 600 L 0 600 Z`}
          fill="#bfdbfe"
          opacity="0.3"
        />
        
        {/* 東海道のルート */}
        <polyline
          points={tokaidoData.stations.map(station => {
            const { x, y } = latLngToXY(station.lat, station.lng);
            return `${x},${y}`;
          }).join(' ')}
          fill="none"
          stroke="#1e40af"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
        
        {/* 各宿場 */}
        {tokaidoData.stations.map((station, index) => {
          const { x, y } = latLngToXY(station.lat, station.lng);
          const isActive = station.id === currentStationId;
          const isStartEnd = station.id === 0 || station.id === 54;
          
          return (
            <g key={station.id}>
              {/* アクティブな宿場の強調表示 */}
              {isActive && (
                <>
                  <circle
                    cx={x} cy={y} r="25"
                    fill="#ef4444"
                    opacity="0.2"
                    className="animate-ping"
                  />
                  <circle
                    cx={x} cy={y} r="15"
                    fill="#ef4444"
                    opacity="0.3"
                    className="animate-pulse"
                  />
                </>
              )}
              
              {/* 宿場のマーカー */}
              <circle
                cx={x}
                cy={y}
                r={isActive ? 10 : isStartEnd ? 8 : 5}
                fill={isActive ? '#ef4444' : isStartEnd ? '#3b82f6' : '#64748b'}
                stroke="white"
                strokeWidth="2"
                filter={isActive ? "url(#glow)" : undefined}
              />
              
              {/* 宿場名（主要な宿場のみ） */}
              {(isActive || isStartEnd || index % 10 === 0) && (
                <g>
                  <rect
                    x={x - 40}
                    y={y - 28}
                    width="80"
                    height="18"
                    fill="white"
                    opacity="0.9"
                    rx="3"
                  />
                  <text
                    x={x}
                    y={y - 14}
                    textAnchor="middle"
                    fontSize={isActive ? "12" : "10"}
                    fontWeight={isActive ? "bold" : "normal"}
                    fill={isActive ? '#ef4444' : '#1f2937'}
                  >
                    {station.name}
                  </text>
                  {isActive && (
                    <text
                      x={x}
                      y={y + 20}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#6b7280"
                    >
                      {station.modernName}
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}
        
        {/* 凡例 */}
        <g transform="translate(20, 20)">
          <rect x="0" y="0" width="150" height="90" fill="white" stroke="#e5e7eb" rx="5" opacity="0.95"/>
          <text x="10" y="20" fontSize="14" fontWeight="bold">東海道五十三次</text>
          <circle cx="20" cy="40" r="5" fill="#64748b"/>
          <text x="30" y="44" fontSize="11">宿場</text>
          <circle cx="20" cy="60" r="8" fill="#3b82f6"/>
          <text x="30" y="64" fontSize="11">起点・終点</text>
          <circle cx="20" cy="80" r="10" fill="#ef4444" className="animate-pulse"/>
          <text x="30" y="84" fontSize="11">現在位置</text>
        </g>
        
        {/* 距離スケール */}
        <g transform="translate(850, 550)">
          <line x1="0" y1="0" x2="100" y2="0" stroke="#374151" strokeWidth="2"/>
          <line x1="0" y1="-5" x2="0" y2="5" stroke="#374151" strokeWidth="2"/>
          <line x1="100" y1="-5" x2="100" y2="5" stroke="#374151" strokeWidth="2"/>
          <text x="50" y="-10" textAnchor="middle" fontSize="10">約50km</text>
        </g>
      </svg>
    </div>
  );
};

export default TokaidoRealMap;