import React, { useState, useEffect } from 'react';
import useAppStore from '../../store/useAppStore';
import tokaidoData from '../../assets/data/tokaidoFullData.json';

const StationList: React.FC = () => {
  const { currentStationId, setCurrentStation } = useAppStore();
  const [selectedStationId, setSelectedStationId] = useState<number>(currentStationId ?? 0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentStationId !== null) {
      setSelectedStationId(currentStationId);
      const stationElement = document.getElementById(`station-${currentStationId}`);
      if (stationElement) {
        stationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStationId]);

  const filteredStations = tokaidoData.stations.filter(station => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return station.name.includes(searchTerm) || station.modernName.includes(searchTerm) || (station as any).romaName?.toLowerCase().includes(lowerCaseSearchTerm);
  }
  );

  const handleStationClick = (stationId: number) => {
    setSelectedStationId(stationId);
    setCurrentStation(stationId);
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
            const segments = tokaidoData.segments.filter(seg => seg.stationId === station.id);
            const isSelected = selectedStationId === station.id;
            return (
              <div
                key={station.id}
                id={`station-${station.id}`}
                onClick={() => handleStationClick(station.id)}
                className={`p-3 rounded cursor-pointer transition-all ${isSelected ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300' : 'bg-white hover:bg-blue-50 shadow'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold">
                      {station.id === 0 ? '起点' : station.id === 54 ? '終点' : `第${station.id}宿`}: {station.name}
                    </div>
                    <div className={`text-xs mt-1 ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                      {station.modernName}
                    </div>
                    {segments.length > 0 && (
                      <div className={`text-xs mt-2 italic ${isSelected ? 'text-blue-100' : 'text-gray-600'}`}>
                        「{segments[0].text}」
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StationList;