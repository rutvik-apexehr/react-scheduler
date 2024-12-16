import React, { useMemo } from 'react';
import { format, addHours, isSameHour } from 'date-fns';
import { motion } from 'framer-motion';
import {Appointment} from "../types";

interface TimelineProps {
  date: Date;
  appointments: Appointment[];
  timeRanges?: TimeRange[];
  showCurrentTime?: boolean;
  onAppointmentCreate?: (appointment: Omit<Appointment, 'id'>) => void;
  onAppointmentUpdate?: (appointment: Appointment) => void;
}

export interface TimeRange {
  start: string;
  end: string;
  label: string;
  color?: string;
}

const TimelineView: React.FC<TimelineProps> = ({
                                                 date,
                                                 appointments,
                                                 timeRanges,
                                                 showCurrentTime = true,
                                                 onAppointmentCreate,
                                                 onAppointmentUpdate
                                               }) => {
  const hours = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = addHours(new Date().setHours(0, 0, 0, 0), i);
      return format(hour, 'HH:mm');
    });
  }, []);

  const timelineRanges = useMemo(() => {
    if (!timeRanges) {
      return hours.map(hour => ({
        start: hour,
        end: format(addHours(new Date(`2024-01-01 ${hour}`), 1), 'HH:mm'),
        label: format(new Date(`2024-01-01 ${hour}`), 'ha')
      }));
    }
    return timeRanges;
  }, [hours, timeRanges]);

  const getCurrentTimePosition = () => {
    const now = new Date();
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    return (totalMinutes / (24 * 60)) * 100;
  };

  return (
    <div className="relative h-full overflow-x-auto">
      {/* Timeline Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="flex">
          {timelineRanges.map((range, index) => (
            <div
              key={index}
              className="flex-1 p-2 text-center border-r"
              style={{
                backgroundColor: 'green',
                minWidth: '100px'
              }}
            >
              {range.label}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="relative min-h-[600px]">
        {/* Time Indicators */}
        <div className="absolute inset-0 flex pointer-events-none">
          {hours.map((hour, index) => (
            <div
              key={hour}
              className="flex-1 border-r border-gray-200"
              style={{minWidth: '100px'}}
            >
              {index % 2 === 0 && (
                <div className="absolute top-0 -translate-x-1/2 text-xs text-gray-500">
                  {format(new Date(`2024-01-01 ${hour}`), 'ha')}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Current Time Indicator */}
        {showCurrentTime && (
          <div
            className="absolute top-0 bottom-0 w-px bg-red-500 z-20"
            style={{left: `${getCurrentTimePosition()}%`}}
          >
            <div className="absolute -top-1 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"/>
          </div>
        )}

        {/* Appointments */}
        {appointments.map(appointment => {
          const startDate = new Date(appointment.startTime);
          const endDate = new Date(appointment.endTime);
          const startPosition = (startDate.getHours() * 60 + startDate.getMinutes()) / (24 * 60) * 100;
          const duration = (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000) * 100;

          return (
            <motion.div
              key={appointment.id}
              drag="x"
              dragConstraints={{left: 0, right: 0}}
              dragElastic={0}
              onDragEnd={(_, info) => {
                if (onAppointmentUpdate && Math.abs(info.offset.x) > 50) {
                  // Calculate new time based on drag distance
                  const hourShift = Math.round(info.offset.x / 100);
                  const newStart = addHours(startDate, hourShift);
                  const newEnd = addHours(endDate, hourShift);

                  onAppointmentUpdate({
                    ...appointment,
                    startTime: newStart.toISOString(),
                    endTime: newEnd.toISOString()
                  });
                }
              }}
              className="absolute top-8 h-24 rounded-lg p-2 cursor-move"
              style={{
                left: `${startPosition}%`,
                width: `${duration}%`,
                backgroundColor: appointment.color || '#3b82f6',
                color: 'white'
              }}
            >
              <div className="text-sm font-semibold truncate">{appointment.title}</div>
              <div className="text-xs opacity-90">
                {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineView;