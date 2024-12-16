import React, { useState, useCallback, useRef, useEffect } from 'react';
import { format, parseISO, addDays, startOfDay, eachDayOfInterval } from 'date-fns';

interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  color?: string;
}

interface SchedulerProps {
  appointments: Appointment[];
  viewType: 'day' | 'week' | 'month';
  minTime?: string;
  maxTime?: string;
  timeStep?: number;
  onAppointmentCreate?: (appointment: Omit<Appointment, 'id'>) => void;
  onAppointmentUpdate?: (appointment: Appointment) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
  onAppointmentHover?: (appointment: Appointment) => void;
}

const AppointmentModal = ({
                            isOpen,
                            onClose,
                            onSave,
                          }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string }) => void;
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center">
      <div className="bg-card p-6 rounded-lg w-96 shadow-lg border">
        <h2 className="text-xl font-bold mb-4 text-card-foreground">New Appointment</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full mb-4 p-2 rounded-md bg-background text-foreground border border-input focus:ring-2 focus:ring-ring focus:outline-none"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full mb-4 p-2 rounded-md bg-background text-foreground border border-input focus:ring-2 focus:ring-ring focus:outline-none"
          rows={4}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave({ title, description });
              setTitle('');
              setDescription('');
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const Scheduler: React.FC<SchedulerProps> = ({
                                               appointments = [],
                                               viewType = 'week',
                                               minTime = '09:00',
                                               maxTime = '17:00',
                                               timeStep = 30,
                                               onAppointmentCreate,
                                               onAppointmentUpdate,
                                               onAppointmentClick,
                                               onAppointmentHover,
                                             }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    startTime: string;
    endTime: string;
  } | null>(null);
  const schedulerRef = useRef<HTMLDivElement>(null);

  const generateTimeSlots = useCallback(() => {
    const slots = [];
    const [startHour] = minTime.split(':').map(Number);
    const [endHour] = maxTime.split(':').map(Number);

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += timeStep) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  }, [minTime, maxTime, timeStep]);

  const generateDays = useCallback(() => {
    const today = startOfDay(new Date());
    const daysCount = viewType === 'day' ? 1 : viewType === 'week' ? 7 : 31;

    return eachDayOfInterval({
      start: today,
      end: addDays(today, daysCount - 1),
    });
  }, [viewType]);

  const handleSlotClick = (date: Date, startTime: string) => {
    const endTimeHour = parseInt(startTime.split(':')[0]) + 1;
    const endTime = `${endTimeHour.toString().padStart(2, '0')}:${startTime.split(':')[1]}`;

    setSelectedSlot({
      date,
      startTime,
      endTime,
    });
    setIsModalOpen(true);
  };

  const renderAppointments = (day: Date, timeSlot: string) => {
    const dayAppointments = appointments.filter(apt => {
      const aptDate = format(parseISO(apt.startTime), 'yyyy-MM-dd');
      const slotDate = format(day, 'yyyy-MM-dd');
      const aptTime = format(parseISO(apt.startTime), 'HH:mm');
      return aptDate === slotDate && aptTime === timeSlot;
    });

    return dayAppointments.map(apt => (
      <div
        key={apt.id}
        className="absolute inset-x-0 bg-primary text-primary-foreground p-1 text-sm rounded-md cursor-pointer"
        style={{
          backgroundColor: apt.color || 'hsl(var(--primary))',
          zIndex: 10,
        }}
        onClick={() => onAppointmentClick?.(apt)}
        onMouseEnter={() => onAppointmentHover?.(apt)}
      >
        {apt.title}
      </div>
    ));
  };

  const timeSlots = generateTimeSlots();
  const days = generateDays();

  return (
    <div className="w-full h-full bg-card rounded-lg overflow-hidden border shadow-sm" ref={schedulerRef}>
      <div className="flex h-full">
        {/* Time column */}
        <div className="w-20 border-r bg-muted flex-shrink-0">
          <div className="h-12 border-b bg-muted" /> {/* Empty header cell */}
          {timeSlots.map(time => (
            <div
              key={time}
              className="h-12 border-b flex items-center justify-center text-sm text-muted-foreground"
            >
              {time}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex min-w-full">
            {days.map(day => (
              <div key={format(day, 'yyyy-MM-dd')} className="flex-1 min-w-[200px]">
                <div className="h-12 border-b bg-muted flex flex-col items-center justify-center">
                  <div className="font-bold text-sm text-foreground">{format(day, 'EEE')}</div>
                  <div className="text-sm text-muted-foreground">{format(day, 'MM/dd')}</div>
                </div>
                {timeSlots.map(timeSlot => (
                  <div
                    key={`${format(day, 'yyyy-MM-dd')}-${timeSlot}`}
                    className="h-12 border-b border-r relative hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => handleSlotClick(day, timeSlot)}
                  >
                    {renderAppointments(day, timeSlot)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSlot(null);
        }}
        onSave={(data) => {
          if (onAppointmentCreate && selectedSlot) {
            const startDate = new Date(selectedSlot.date);
            const [startHour, startMinute] = selectedSlot.startTime.split(':').map(Number);
            startDate.setHours(startHour, startMinute);

            const endDate = new Date(selectedSlot.date);
            const [endHour, endMinute] = selectedSlot.endTime.split(':').map(Number);
            endDate.setHours(endHour, endMinute);

            onAppointmentCreate({
              title: data.title,
              description: data.description,
              startTime: startDate.toISOString(),
              endTime: endDate.toISOString(),
            });
          }
          setIsModalOpen(false);
          setSelectedSlot(null);
        }}
      />
    </div>
  );
};

export default Scheduler;