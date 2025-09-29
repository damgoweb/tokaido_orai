import React, { useEffect } from 'react';
import useAppStore from '../../store/useAppStore';
import tokaidoData from '../../assets/data/tokaidoFullData.json';

const TextDisplay: React.FC = () => {
  const { 
    currentSegmentId, 
    displayMode, 
    showRuby, 
    fontSize
  } = useAppStore();
  
  // 自動スクロール機能
  useEffect(() => {
    if (currentSegmentId) {
      const element = document.getElementById(`text-segment-${currentSegmentId}`);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [currentSegmentId]);

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const renderText = (segment: any) => {
    if (!showRuby) {
      return <span>{segment.text}</span>;
    }

    return segment.ruby ? (
      <ruby>
        {segment.text}
        <rt className="text-xs">{segment.ruby}</rt>
      </ruby>
    ) : (
      <span>{segment.text}</span>
    );
  };

  // デバッグ情報を追加
  console.log(`全セグメント数: ${tokaidoData.segments.length}`);

  return (
    <div className={`p-4 ${displayMode === 'vertical' ? 'writing-vertical' : ''}`}>
      <div className="mb-2 text-xs text-gray-500">
        全{tokaidoData.segments.length}セグメント
      </div>
      <div className={`${fontSizeClasses[fontSize]}`}>
        {tokaidoData.segments.map((segment) => (
          <div
            id={`text-segment-${segment.id}`}
            key={segment.id}
            className={`mb-4 p-3 rounded transition-colors ${
              currentSegmentId === segment.id 
                ? 'bg-yellow-200 border-l-4 border-yellow-500' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="text-xs text-gray-500 mb-1">
              {segment.stationName} ({segment.id})
            </div>
            <div className={displayMode === 'vertical' ? 'vertical-text' : ''}>
              {renderText(segment)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextDisplay;