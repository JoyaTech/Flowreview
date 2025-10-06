
import React from 'react';

interface SuggestedResponseProps {
  text: string;
  onSelect: () => void;
}

export const SuggestedResponse: React.FC<SuggestedResponseProps> = ({ text, onSelect }) => {
  return (
    <div 
      className="bg-white p-4 rounded-md border border-slate-200 cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all h-full flex flex-col justify-between"
      onClick={onSelect}
    >
      <p className="text-sm text-slate-700 mb-4">{text}</p>
      <button 
        onClick={onSelect}
        className="w-full mt-auto text-sm font-semibold text-indigo-600 hover:text-indigo-800 text-left"
      >
        Use this response →
      </button>
    </div>
  );
};
