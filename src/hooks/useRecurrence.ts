// hooks/useRecurrence.ts
import { useCallback } from 'react';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';
import { Appointment, RecurrenceRule } from '../types';

export const useRecurrence = () => {
  const generateRecurringAppointments = useCallback((
    baseAppointment: Appointment,
    rule: RecurrenceRule,
    startDate: Date,
    endDate: Date
  ): Appointment[] => {
    const appointments: Appointment[] = [];
    let currentDate = new Date(baseAppointment.startTime);

    while (currentDate <= endDate) {
      if (rule.endDate && currentDate > new Date(rule.endDate)) break;
      if (rule.endAfterOccurrences && appointments.length >= rule.endAfterOccurrences) break;

      const duration = new Date(baseAppointment.endTime).getTime() -
        new Date(baseAppointment.startTime).getTime();

      let shouldAdd = false;
      switch (rule.type) {
        case 'daily':
          shouldAdd = true;
          break;
        case 'weekly':
          shouldAdd = rule.daysOfWeek?.includes(currentDate.getDay()) ?? false;
          break;
        case 'monthly':
          shouldAdd = currentDate.getDate() === (rule.dayOfMonth ?? 1);
          break;
        case 'yearly':
          shouldAdd = currentDate.getMonth() === ((rule.monthOfYear ?? 1) - 1);
          break;
      }

      if (shouldAdd && currentDate >= startDate) {
        appointments.push({
          ...baseAppointment,
          id: `${baseAppointment.id}-${currentDate.getTime()}`,
          startTime: currentDate.toISOString(),
          endTime: new Date(currentDate.getTime() + duration).toISOString(),
          isRecurring: true
        });
      }

      switch (rule.type) {
        case 'daily':
          currentDate = addDays(currentDate, rule.interval);
          break;
        case 'weekly':
          currentDate = addWeeks(currentDate, rule.interval);
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, rule.interval);
          break;
        case 'yearly':
          currentDate = addYears(currentDate, rule.interval);
          break;
      }
    }

    return appointments;
  }, []);

  return { generateRecurringAppointments };
};