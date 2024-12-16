import {SchedulerCustomization} from "../types/customization";
import {ViewType} from "../types";
import {useEffect} from "react";
import {addDays, addWeeks} from "date-fns";

export const useSchedulerKeyboard = (
  customization: SchedulerCustomization,
  callbacks: {
    onDateChange: (date: Date) => void;
    onViewChange: (view: ViewType) => void;
    onDelete: (id: string) => void;
  }
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          if (e.ctrlKey || e.metaKey) {
            callbacks.onDateChange(addWeeks(new Date(), -1));
          } else {
            callbacks.onDateChange(addDays(new Date(), -1));
          }
          break;
        case 'ArrowRight':
          if (e.ctrlKey || e.metaKey) {
            callbacks.onDateChange(addWeeks(new Date(), 1));
          } else {
            callbacks.onDateChange(addDays(new Date(), 1));
          }
          break;
        case 'Delete':
          // Handle delete if an appointment is selected
          break;
        // Add more keyboard shortcuts
      }
    };

    if (!customization.disableKeyboardShortcuts) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [callbacks, customization.disableKeyboardShortcuts]);
};