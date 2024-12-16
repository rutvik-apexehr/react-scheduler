import {
  format,
  parseISO,
  startOfDay,
  endOfDay,
  eachDayOfInterval,
  addDays,
  startOfWeek as datesFnsStartOfWeek,
  endOfWeek as datesFnsEndOfWeek,
  startOfMonth as datesFnsStartOfMonth,
  endOfMonth as datesFnsEndOfMonth
} from 'date-fns';
import { TimeSlot, ViewType } from '../types';
import {Day} from "date-fns/types";


export const timeToPixels = (time: string, minTime: string, pixelsPerMinute: number): number => {
  const [minHour, minMinute] = minTime.split(':').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const diffInMinutes = (hour - minHour) * 60 + (minute - minMinute);
  return diffInMinutes * pixelsPerMinute;
};

export const pixelsToTime = (pixels: number, minTime: string, pixelsPerMinute: number): string => {
  const [hour, minute] = minTime.split(':').map(Number);
  const totalMinutes = pixels / pixelsPerMinute + hour * 60 + minute;
  const newHour = Math.floor(totalMinutes / 60);
  const newMinute = Math.floor(totalMinutes % 60);
  return `${newHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`;
};

export const generateTimeSlots = (
  minTime: string,
  maxTime: string,
  timeStep: number
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const [startHour] = minTime.split(':').map(Number);
  const [endHour] = maxTime.split(':').map(Number);

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += timeStep) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        height: 50
      });
    }
  }
  return slots;
};

// New utility functions for week and month calculations
export const getStartOfWeek = (date: Date, firstDayOfWeek: Day = 0): Date => {
  return datesFnsStartOfWeek(date, { weekStartsOn: firstDayOfWeek });
};

export const getEndOfWeek = (date: Date, firstDayOfWeek: Day = 0): Date => {
  return datesFnsEndOfWeek(date, { weekStartsOn: firstDayOfWeek });
};

export const generateDaysForView = (
  viewType: ViewType,
  currentDate: Date,
  firstDayOfWeek: Day = 0,
  showWeekends: boolean = true
): Date[] => {
  let start: Date;
  let end: Date;

  switch (viewType) {
    case 'day':
      start = startOfDay(currentDate);
      end = endOfDay(currentDate);
      break;
    case 'week':
      start = getStartOfWeek(currentDate, firstDayOfWeek);
      end = getEndOfWeek(currentDate, firstDayOfWeek);
      break;
    case 'month':
      start = getStartOfMonth(currentDate);
      end = getEndOfMonth(currentDate);
      break;
    default:
      throw new Error(`Invalid view type: ${viewType}`);
  }

  return eachDayOfInterval({ start, end })
    .filter(date => showWeekends || ![0, 6].includes(date.getDay()));
};

export const getStartOfMonth = (date: Date): Date => {
  return datesFnsStartOfMonth(date);
};

export const getEndOfMonth = (date: Date): Date => {
  return datesFnsEndOfMonth(date);
};
// Additional utility function for week number calculation
export const getWeekNumber = (date: Date): number => {
  const start = getStartOfWeek(datesFnsStartOfMonth(date));
  const days = eachDayOfInterval({ start, end: date });
  return Math.ceil(days.length / 7);
};

// Utility function to check if a date falls on a weekend
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

// Utility function to check if two dates are in the same month
export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
};