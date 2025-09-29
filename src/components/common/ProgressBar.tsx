import React from 'react';

export const ProgressBar: React.FC = () => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
    </div>
  );
};

export default ProgressBar;