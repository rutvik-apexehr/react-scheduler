// components/AppointmentTemplate.tsx
import React from 'react';
import { Pencil, Trash2, RepeatIcon } from 'lucide-react';
import { Appointment } from '../types';
import {SchedulerCustomization} from "../types/customization";

interface AppointmentTemplateProps {
  appointment: Appointment;
  style: React.CSSProperties;
  customization: SchedulerCustomization;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const AppointmentTemplate: React.FC<AppointmentTemplateProps> = ({
                                                                   appointment,
                                                                   style,
                                                                   customization,
                                                                   onClick,
                                                                   onEdit,
                                                                   onDelete
                                                                 }) => {
  if (customization.appointmentRenderer) {
    return customization.appointmentRenderer(appointment);
  }

  return (
    <div
      className="group relative p-2 overflow-hidden"
      style={style}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="font-semibold truncate">{appointment.title}</div>
        {(onEdit || onDelete) && (
          <div className="hidden group-hover:flex gap-1">
            {onEdit && (
              <button
                className="p-1 hover:bg-white/20 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                className="p-1 hover:bg-white/20 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {appointment.description && (
        <div className="text-sm opacity-90 truncate mt-1">
          {appointment.description}
        </div>
      )}

      {appointment.recurrence && (
        <div className="text-xs mt-1 flex items-center gap-1">
          <RepeatIcon className="w-3 h-3" />
          {appointment.recurrence.type}
        </div>
      )}
    </div>
  );
};

export default AppointmentTemplate;