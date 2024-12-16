import {SchedulerCustomization} from "../types/customization";
import React from "react";

export const DensitySelector: React.FC<{
  value: SchedulerCustomization['density'];
  onChange: (density: SchedulerCustomization['density']) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="flex gap-2">
      {(['compact', 'comfortable', 'spacious'] as const).map(density => (
        <button
          key={density}
          className={`px-3 py-1 rounded ${
            value === density ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
          onClick={() => onChange(density)}
        >
          {density}
        </button>
      ))}
    </div>
  );
};