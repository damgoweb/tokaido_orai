import React, { useState } from 'react';
import useAppStore from '../../store/useAppStore';

export const SettingsMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { fontSize, showRuby, displayMode, setFontSize, setShowRuby, setDisplayMode } = useAppStore();

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
      >
        設定
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
          <h3 className="font-bold mb-3">表示設定</h3>
          
          <div className="mb-3">
            <label className="text-sm text-gray-700 block mb-1">文字サイズ</label>
            <select 
              value={fontSize} 
              onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large')}
              className="w-full px-2 py-1 border rounded text-sm"
            >
              <option value="small">小</option>
              <option value="medium">中</option>
              <option value="large">大</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={showRuby}
                onChange={(e) => setShowRuby(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">ルビを表示</span>
            </label>
          </div>
          
          <div className="mb-3">
            <label className="text-sm text-gray-700 block mb-1">表示モード</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setDisplayMode('horizontal')}
                className={`flex-1 px-2 py-1 text-sm rounded ${
                  displayMode === 'horizontal' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200'
                }`}
              >
                横書き
              </button>
              <button 
                onClick={() => setDisplayMode('vertical')}
                className={`flex-1 px-2 py-1 text-sm rounded ${
                  displayMode === 'vertical' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200'
                }`}
              >
                縦書き
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="w-full px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded text-sm"
          >
            閉じる
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;