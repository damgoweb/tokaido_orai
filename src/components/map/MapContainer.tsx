import React, { useState, useEffect } from 'react';
import tokaidoData from '../../assets/data/tokaidoFullData.json';
import useAppStore from '../../store/useAppStore';

const MapContainer: React.FC = () => {
  const { currentStationId } = useAppStore();
  const [selectedStation, setSelectedStation] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (currentStationId !== null) {
      setSelectedStation(currentStationId);
      // スクロールして表示
      const element = document.getElementById(`station-${currentStationId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStationId]);

  const filteredStations = tokaidoData.stations.filter(station =>
    station.name.includes(searchTerm) || 
    station.modernName.includes(searchTerm)
  );

  const handleStationClick = (stationId: number) => {
    setSelectedStation(stationId);
    useAppStore.getState().setCurrentStation(stationId);
  };

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col">
      <div className="p-3 border-b bg-white">
        <h3 className="text-lg font-bold mb-2">東海道五十三次</h3>
        <input
          type="text"
          placeholder="宿場を検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-1 border rounded text-sm"
        />
      </div>
      
      <div className="flex-1 overflow-auto p-3">
        <div className="grid grid-cols-1 gap-2">
          {filteredStations.map((station) => {
            const segments = tokaidoData.segments.filter(s => s.stationId === station.id);
            const isHighlighted = selectedStation === station.id;
            
            return (
              <div
                key={station.id}
                id={`station-${station.id}`}
                onClick={() => handleStationClick(station.id)}
                className={`p-3 rounded cursor-pointer transition-all ${
                  isHighlighted
                    ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300 animate-pulse'
                    : 'bg-white hover:bg-blue-50 shadow'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold">
                      {station.id === 0 ? '起点' : 
                       station.id === 54 ? '終点' : 
                       `第${station.id}宿`}: {station.name}
                    </div>
                    <div className={`text-xs mt-1 ${
                      isHighlighted ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {station.modernName}
                    </div>
                    {segments.length > 0 && (
                      <div className={`text-xs mt-2 italic ${
                        isHighlighted ? 'text-blue-100' : 'text-gray-600'
                      }`}>
                        「{segments[0].text}」
                      </div>
                    )}
                  </div>
                  <div className={`text-xs ${
                    isHighlighted ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {station.lat.toFixed(2)}, {station.lng.toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="p-2 border-t bg-white text-xs text-gray-600">
        全{tokaidoData.stations.length}宿場 | 
        選択: {tokaidoData.stations.find(s => s.id === selectedStation)?.name || '未選択'}
      </div>
    </div>
  );
};

export default MapContainer;