import {ViewType} from "../types";
import {addDays, eachDayOfInterval, endOfDay, startOfDay} from "date-fns";
import {getEndOfMonth, getStartOfMonth, getStartOfWeek} from "./time";
import {Day} from "date-fns/types";

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
      start = startOfDay(getStartOfWeek(currentDate, firstDayOfWeek));
      end = addDays(start, showWeekends ? 6 : 4);
      break;
    case 'month':
      start = startOfDay(getStartOfMonth(currentDate));
      end = endOfDay(getEndOfMonth(currentDate));
      break;
    default:
      throw new Error(`Invalid view type: ${viewType}`);
  }

  return eachDayOfInterval({ start, end })
    .filter(date => showWeekends || ![0, 6].includes(date.getDay()));
};