import React from 'react';
import type { FilterType } from '../App';

interface FilterControlsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({ currentFilter, onFilterChange }) => {
  const getButtonClasses = (filter: FilterType) => {
    const baseClasses = "px-4 py-2 text-sm font-medium rounded-md transition-colors";
    if (currentFilter === filter) {
      return `${baseClasses} bg-indigo-100 text-indigo-700`;
    }
    return `${baseClasses} text-slate-600 hover:bg-slate-100`;
  };

  return (
    <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Reviews Inbox</h2>
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-4">
            <button
            onClick={() => onFilterChange('all')}
            className={getButtonClasses('all')}
            >
            All Reviews
            </button>
            <button
            onClick={() => onFilterChange('needsReply')}
            className={getButtonClasses('needsReply')}
            >
            Needs Reply
            </button>
        </div>
    </div>
  );
};
