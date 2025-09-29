import React from 'react';

const TextControls: React.FC = () => {
  return (
    <div className="flex gap-2 p-2 border-b">
      <button className="px-2 py-1 bg-gray-200 rounded text-sm">縦書き</button>
      <button className="px-2 py-1 bg-gray-200 rounded text-sm">横書き</button>
      <button className="px-2 py-1 bg-gray-200 rounded text-sm">文字大</button>
    </div>
  );
};

export default TextControls;
