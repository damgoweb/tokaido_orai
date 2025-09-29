import React, { useEffect } from 'react';
import TextDisplay from './TextDisplay';
import useAppStore from '../../store/useAppStore';

const TextView: React.FC = () => {
  const { currentSegmentId } = useAppStore();
  
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
  
  return (
    <div className="bg-white rounded-lg shadow-lg h-full overflow-y-auto">
      <TextDisplay />
    </div>
  );
};

export default TextView;