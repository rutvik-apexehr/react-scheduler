import React from 'react';
import { Holiday, SchedulerCustomization } from '../types/scheduler';

interface HolidayIndicatorProps {
  holiday: Holiday;
  customization: SchedulerCustomization;
}

export const HolidayIndicator: React.FC<HolidayIndicatorProps> = ({
                                                                    holiday,
                                                                    customization
                                                                  }) => {
  const theme = customization.theme;

  return (
    <div
      className="absolute top-0 left-0 right-0"
    >
      <div
        className="h-1"
        style={{
          backgroundColor: holiday.color || theme?.holiday || '#dc2626'
        }}
      />
      <div className="absolute top-1 left-0 right-0 px-2 py-1 text-xs bg-white/90 truncate">
        {holiday.name}
      </div>
    </div>
  );
};