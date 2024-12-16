// types.ts
export type ViewType = 'timeline' | 'day' | 'week' | 'month';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurrenceRule {
  type: RecurrenceType;
  interval: number;
  endDate?: string;
  endAfterOccurrences?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  monthOfYear?: number;
}

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  color?: string;
  recurrence?: RecurrenceRule;
  isRecurring?: boolean;
}

export interface TimeSlot {
  time: string;
  height: number;
}

export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  border: string;
  hover: string;
  holidayBackground: string;  // Added for holiday styling
  holiday: string;           // Added for holiday indicators
}

export interface SchedulerProps {
  appointments: Appointment[];
  viewType: ViewType;
  minTime?: string;
  maxTime?: string;
  timeStep?: number;
  theme?: Partial<Theme>;
  firstDayOfWeek?: number; // 0-6, 0 = Sunday
  readonly?: boolean;
  showWeekends?: boolean;
  height?: string | number;
  locale?: string;

  // Callbacks
  onAppointmentCreate?: (appointment: Omit<Appointment, 'id'>) => void;
  onAppointmentUpdate?: (appointment: Appointment) => void;
  onAppointmentDelete?: (appointmentId: string) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
  onAppointmentHover?: (appointment: Appointment) => void;
  onDateNavigate?: (date: Date) => void;
  onViewChange?: (view: ViewType) => void;
}

// Custom hook types
export interface UseZoomReturn {
  timeStep: number;
  setTimeStep: (step: number) => void;
  handleZoom: (event: WheelEvent) => void;
}

export interface UseDragReturn {
  dragStart: { time: string; date: Date } | null;
  dragEnd: { time: string; date: Date } | null;
  handleDragStart: (e: React.MouseEvent, date: Date) => void;
  handleDragEnd: (e: React.MouseEvent, date: Date) => void;
}