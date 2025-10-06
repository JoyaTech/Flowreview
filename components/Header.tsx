
import React from 'react';
import { LogoIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <LogoIcon className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-slate-900">
              Review<span className="text-indigo-600">Flow</span>
            </span>
          </div>
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Dashboard</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Campaigns</a>
            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">Reviews</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Reports</a>
          </nav>
        </div>
      </div>
    </header>
  );
};
