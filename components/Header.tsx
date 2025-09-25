
import React from 'react';
import { WifiIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
        <WifiIcon className="h-8 w-8 text-primary" />
        <h1 className="ml-3 text-2xl font-bold text-neutral-800 tracking-tight">
          Telecom Plan Finder
        </h1>
      </div>
    </header>
  );
};
