import React, { useState } from 'react';
import StationList from './StationList';
import TokaidoRealMap from './TokaidoRealMap';
import TokaidoUkiyoe from './TokaidoUkiyoe';

const MapView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'map' | 'ukiyoe'>('list');
  
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
          📋 宿場リスト
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex-1 px-2 py-2 text-sm font-medium transition-colors ${
            activeTab === 'map'
              ? 'bg-white border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🗺️ 現代地図
        </button>
        <button
          onClick={() => setActiveTab('ukiyoe')}
          className={`flex-1 px-2 py-2 text-sm font-medium transition-colors ${
            activeTab === 'ukiyoe'
              ? 'bg-white border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🎨 浮世絵地図
        </button>
      </div>
      
      {/* タブコンテンツ */}
      <div className="flex-1 overflow-hidden">
        <div className={activeTab === 'list' ? 'h-full' : 'hidden'}><StationList /></div>
        <div className={activeTab === 'map' ? 'h-full' : 'hidden'}><TokaidoRealMap /></div>
        <div className={activeTab === 'ukiyoe' ? 'h-full' : 'hidden'}><TokaidoUkiyoe /></div>
      </div>
    </div>
  );
};

export default MapView;