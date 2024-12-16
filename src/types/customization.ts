import {Appointment, Theme, TimeSlot} from "./index";
import {Resource} from "../hooks/useSchedulerCustomization";

export interface SchedulerCustomization {
  // Visual Customization
  theme?: Theme;
  density?: 'compact' | 'comfortable' | 'spacious';
  headerFormat?: string;
  timeFormat?: '12' | '24';
  dateFormat?: string;

  disableKeyboardShortcuts?: boolean;

  // Behavior Customization
  dragThreshold?: number;
  snapToTime?: boolean;
  allowOverlap?: boolean;
  minAppointmentDuration?: number;
  maxAppointmentDuration?: number;

  // Feature Toggles
  enableRecurring?: boolean;
  enableDragging?: boolean;
  enableResizing?: boolean;
  showWeekNumbers?: boolean;
  showCurrentTimeIndicator?: boolean;

  // Resource View Options
  resourceGroupBy?: 'type' | 'department' | 'custom';
  resourceViewMode?: 'timeline' | 'columns';

  // Calendar Options
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  excludeDates?: Date[];
  includeDates?: Date[];
  holidays?: Array<{ date: Date; name: string; color?: string }>;

  // Custom Renderers
  appointmentRenderer?: (appointment: Appointment) => React.ReactNode;
  timeSlotRenderer?: (slot: TimeSlot) => React.ReactNode;
  headerRenderer?: (date: Date) => React.ReactNode;
  resourceRenderer?: (resource: Resource) => React.ReactNode;
}