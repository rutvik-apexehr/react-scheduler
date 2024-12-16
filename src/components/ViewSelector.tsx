import React from 'react';
import { ViewType } from '../types';

interface ViewSelectorProps {
  value: ViewType;
  onChange: (view: ViewType) => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ value, onChange }) => {
  const views: ViewType[] = ['day', 'week', 'month', 'timeline'];

  return (
    <div className="flex gap-2">
      {views.map((view) => (
        <button
          key={view}
          className={`px-3 py-1 rounded ${
            value === view
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => onChange(view)}
        >
          {view.charAt(0).toUpperCase() + view.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default ViewSelector;
