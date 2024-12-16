import React, { useState, useCallback, useMemo } from 'react';
import { Day } from 'date-fns';

export type ResourceGroupKey = 'type' | 'department' | 'custom';

// Types
export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  border: string;
  hover: string;
  todayBackground: string;
  weekendBackground: string;
  holidayBackground: string;
  holiday: string;
  success: string;
  error: string;
  warning: string;
}

export interface Resource {
  id: string;
  title: string;
  type: string;
  department: string;
  custom?: string;
  color?: string;
}

export interface Holiday {
  date: Date;
  name: string;
  color?: string;
}

export interface TimeSlot {
  time: string;
  height: number;
}

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  color?: string;
  resourceId?: string;
}

export interface SchedulerCustomization {
  // Visual Customization
  theme?: Partial<Theme>;
  density: 'compact' | 'comfortable' | 'spacious';
  headerFormat: string;
  timeFormat: '12' | '24';
  dateFormat: string;

  // Behavior Customization
  dragThreshold: number;
  snapToTime: boolean;
  allowOverlap: boolean;
  minAppointmentDuration: number;
  maxAppointmentDuration: number;

  // Feature Toggles
  enableRecurring: boolean;
  enableDragging: boolean;
  enableResizing: boolean;
  showWeekNumbers: boolean;
  showCurrentTimeIndicator: boolean;
  disableKeyboardShortcuts: boolean;

  // Resource View Options
  resourceGroupBy?: ResourceGroupKey;
  resourceViewMode: 'timeline' | 'columns';

  // Calendar Options
  weekStartsOn: Day;
  excludeDates: Date[];
  includeDates: Date[];
  holidays: Holiday[];

  // Custom Renderers
  appointmentRenderer?: (appointment: Appointment) => React.ReactNode;
  timeSlotRenderer?: (slot: TimeSlot) => React.ReactNode;
  headerRenderer?: (date: Date) => React.ReactNode;
  resourceRenderer?: (resource: Resource) => React.ReactNode;
}

// Update defaultTheme with new properties
export const defaultTheme: Theme = {
  primary: '#3b82f6',
  secondary: '#f3f4f6',
  background: '#ffffff',
  text: '#1f2937',
  border: '#e5e7eb',
  hover: '#f9fafb',
  todayBackground: '#f8fafc',
  weekendBackground: '#f1f5f9',
  holidayBackground: '#fee2e2',
  holiday: '#dc2626',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b'
};

// Then use it in defaultCustomization
const defaultCustomization: SchedulerCustomization = {
  theme: defaultTheme,
  density: 'comfortable',
  headerFormat: 'MMMM yyyy',
  timeFormat: '24',
  dateFormat: 'dd MMM yyyy',
  dragThreshold: 5,
  snapToTime: true,
  allowOverlap: false,
  minAppointmentDuration: 30,
  maxAppointmentDuration: 480,
  enableRecurring: true,
  enableDragging: true,
  enableResizing: true,
  showWeekNumbers: false,
  showCurrentTimeIndicator: true,
  disableKeyboardShortcuts: false,
  resourceViewMode: 'columns',
  weekStartsOn: 0 as Day,
  excludeDates: [],
  includeDates: [],
  holidays: []
};

export const useSchedulerCustomization = (
  initialCustomization: Partial<SchedulerCustomization> = {}
) => {
  const [customization, setCustomization] = useState<SchedulerCustomization>({
    ...defaultCustomization,
    ...initialCustomization
  });

  const updateCustomization = useCallback((
    updates: Partial<SchedulerCustomization>
  ) => {
    setCustomization(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const getDensityConfig = useCallback(() => {
    switch (customization.density) {
      case 'compact':
        return {
          timeSlotHeight: 30,
          fontSize: 'text-xs',
          padding: 'p-1',
          gap: 'gap-1'
        };
      case 'spacious':
        return {
          timeSlotHeight: 60,
          fontSize: 'text-base',
          padding: 'p-4',
          gap: 'gap-4'
        };
      default:
        return {
          timeSlotHeight: 45,
          fontSize: 'text-sm',
          padding: 'p-2',
          gap: 'gap-2'
        };
    }
  }, [customization.density]);

  const getTimeSlotStyle = useCallback((
    slot: TimeSlot,
    isToday: boolean,
    isWeekend: boolean
  ) => {
    const { timeSlotHeight } = getDensityConfig();
    const theme = customization.theme || defaultTheme;

    return {
      height: `${timeSlotHeight}px`,
      backgroundColor: isToday
        ? theme.todayBackground
        : isWeekend
          ? theme.weekendBackground
          : theme.background,
      borderColor: theme.border
    };
  }, [customization.theme, getDensityConfig]);

  const getAppointmentStyle = useCallback((appointment: Appointment) => {
    const theme = customization.theme || defaultTheme;

    return {
      backgroundColor: appointment.color || theme.primary,
      color: '#ffffff',
      cursor: customization.enableDragging ? 'move' : 'pointer',
      borderRadius: '0.375rem',
      transition: 'all 150ms ease-in-out'
    };
  }, [customization.theme, customization.enableDragging]);

  const groupResources = useCallback((resources: Resource[]) => {
    if (!customization.resourceGroupBy) return resources;

    return resources.reduce<Record<string, Resource[]>>((groups, resource) => {
      const key = customization.resourceGroupBy!;
      const groupValue = resource[key] || 'undefined';
      return {
        ...groups,
        [groupValue]: [...(groups[groupValue] || []), resource]
      };
    }, {});
  }, [customization.resourceGroupBy]);

  const validators = useMemo(() => ({
    isDateExcluded: (date: Date) =>
      customization.excludeDates.some(d => d.getTime() === date.getTime()),

    isDateIncluded: (date: Date) =>
      customization.includeDates.length === 0 ||
      customization.includeDates.some(d => d.getTime() === date.getTime()),

    isHoliday: (date: Date) =>
      customization.holidays.find(h => h.date.getTime() === date.getTime()),

    isValidAppointmentDuration: (startTime: Date, endTime: Date) => {
      const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      return duration >= customization.minAppointmentDuration &&
        duration <= customization.maxAppointmentDuration;
    }
  }), [customization.excludeDates, customization.includeDates, customization.holidays,
    customization.minAppointmentDuration, customization.maxAppointmentDuration]);

  return {
    customization,
    updateCustomization,
    getDensityConfig,
    getTimeSlotStyle,
    getAppointmentStyle,
    groupResources,
    validators,
    defaultTheme
  };
};