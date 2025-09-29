import React, { useState } from 'react';
import MapContainer from './MapContainer';
import TokaidoRealMap from './TokaidoRealMap';
// import TokaidoHistoricalMap from './TokaidoHistoricalMap';
import TokaidoUkiyoe from './TokaidoUkiyoe';

const MapView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'map' | 'historical' | 'ukiyoe'>('list');
  
  return (
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
      {/* タブヘッダー */}
      <div className="flex border-b bg-gray-50">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 px-2 py-2 text-sm font-medium transition-colors ${
            activeTab === 'list'
              ? 'bg-white border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📋 リスト
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex-1 px-2 py-2 text-sm font-medium transition-colors ${
            activeTab === 'map'
              ? 'bg-white border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🗺️ 地図
        </button>
        <button
          onClick={() => setActiveTab('ukiyoe')}
          className={`flex-1 px-2 py-2 text-sm font-medium transition-colors ${
            activeTab === 'ukiyoe'
              ? 'bg-white border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🎨 浮世絵
        </button>
      </div>
      
      {/* タブコンテンツ */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'list' && <MapContainer />}
        {activeTab === 'map' && <TokaidoRealMap />}
        {activeTab === 'ukiyoe' && <TokaidoUkiyoe />}
      </div>
    </div>
  );
};

export default MapView;