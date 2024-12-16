import {ViewType} from "../types";
import {SchedulerCustomization} from "../types/customization";
import {addDays, format} from "date-fns";
import React from "react";
import {ViewSelector} from "./ViewSelector";
import { DensitySelector } from './DensitySelector';

const CustomHeader: React.FC<{
  date: Date;
  viewType: ViewType;
  customization: SchedulerCustomization;
  onViewChange: (view: ViewType) => void;
  onDateChange: (date: Date) => void;
}> = ({ date, viewType, customization, onViewChange, onDateChange }) => {
  const { headerFormat, dateFormat } = customization;

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded hover:bg-gray-100"
          onClick={() => onDateChange(addDays(date, -1))}
        >
          &lt;
        </button>
        <h2 className="text-xl font-semibold">
          {format(date, headerFormat || 'MMMM yyyy')}
        </h2>
        <button
          className="p-2 rounded hover:bg-gray-100"
          onClick={() => onDateChange(addDays(date, 1))}
        >
          &gt;
        </button>
      </div>

      <div className="flex items-center gap-4">
        <ViewSelector value={viewType} onChange={onViewChange} />
        <DensitySelector
          value={customization.density}
          onChange={density => {
            // Handle density change
          }}
        />
      </div>
    </div>
  );
};