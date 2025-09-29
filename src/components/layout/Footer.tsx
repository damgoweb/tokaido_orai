import React from 'react';
import { ProgressBar } from '../common/ProgressBar';
import { Timeline } from '../common/Timeline';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t px-4 py-2">
      <ProgressBar />
      <Timeline />
    </footer>
  );
};

export default Footer;
