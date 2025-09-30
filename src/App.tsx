import { useState } from 'react';
import { Layout } from './components/layout';
import { TextView } from './components/text';
import { MapView } from './components/map';
import { AudioView } from './components/audio';
import './index.css';

function App() {
  const [activePanel, setActivePanel] = useState<'text' | 'map' | 'audio'>('text');
  
  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-2 h-full" style={{ height: 'calc(100vh - 80px)' }}>
        {/* モバイル用タブ切り替え（lg以下で表示） */}
        <div className="lg:hidden flex border-b bg-white">
          <button
            onClick={() => setActivePanel('text')}
            className={`flex-1 py-2 text-sm font-medium ${
              activePanel === 'text' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            📖 本文
          </button>
          <button
            onClick={() => setActivePanel('map')}
            className={`flex-1 py-2 text-sm font-medium ${
              activePanel === 'map' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            🗺️ 地図
          </button>
          <button
            onClick={() => setActivePanel('audio')}
            className={`flex-1 py-2 text-sm font-medium ${
              activePanel === 'audio' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            🎵 音声
          </button>
        </div>
        
        {/* コンテンツエリア */}
        <div className="flex-1 flex lg:flex-row flex-col gap-2 min-h-0 lg:h-full">
          {/* 本文 */}
          <div className={`
            ${activePanel === 'text' ? 'flex' : 'hidden'} 
            lg:flex flex-col 
            w-full lg:w-80 
            h-full
          `}>
            <TextView />
          </div>
          
          {/* 地図 */}
          <div className={`
            ${activePanel === 'map' ? 'flex' : 'hidden'} 
            lg:flex flex-col flex-1
            h-full
          `}>
            <MapView />
          </div>
          
          {/* 音声 */}
          <div className={`
            ${activePanel === 'audio' ? 'flex' : 'hidden'} 
            lg:flex flex-col w-full lg:w-64 h-full
          `}>
            <AudioView />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;