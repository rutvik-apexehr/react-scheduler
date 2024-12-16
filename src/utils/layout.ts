import {Appointment} from "../types";

export const calculateAppointmentPosition = (
  appointment: Appointment,
  overlappingAppointments: Appointment[],
  columnWidth: number
): { left: number; width: number } => {
  const index = overlappingAppointments.findIndex(a => a.id === appointment.id);
  const totalOverlapping = overlappingAppointments.length;

  const width = columnWidth / totalOverlapping;
  const left = width * index;

  return { left, width };
};