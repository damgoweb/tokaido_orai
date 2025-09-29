import React from 'react';
import ControlPanel from '../common/ControlPanel';
import SettingsMenu from '../common/SettingsMenu';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="px-2 sm:px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
            東海道往来
          </h1>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <ControlPanel />
            </div>
            <SettingsMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;