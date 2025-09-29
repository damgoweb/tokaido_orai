import React, { useEffect, useRef } from 'react';
import TextDisplay from './TextDisplay';
import StationList from './StationList';  // 同じディレクトリのStationListを使用
import useAppStore from '../../store/useAppStore';

const TextView: React.FC = () => {
  const { currentStationId } = useAppStore();
  const stationListRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (currentStationId !== null && stationListRef.current) {
      const element = document.getElementById(`station-item-${currentStationId}`);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
      }
    }
  }, [currentStationId]);
  
  return (
    <div className="bg-white rounded-lg shadow-lg h-full flex">
      <div ref={stationListRef} className="w-32 border-r overflow-y-auto">
        <StationList />
      </div>
      <div className="flex-1 overflow-y-auto">
        <TextDisplay />
      </div>
    </div>
  );
};

export default TextView;