import React from 'react';

const MapControls: React.FC = () => {
  return (
    <div className="absolute top-2 right-2 bg-white p-2 rounded shadow">
      <button className="block mb-1 px-2 py-1 bg-gray-200">+</button>
      <button className="block px-2 py-1 bg-gray-200">-</button>
    </div>
  );
};

export default MapControls;
