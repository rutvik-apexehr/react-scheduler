// hooks/useDrag.ts
import { useState, useCallback } from 'react';
import { UseDragReturn } from '../types';
import { pixelsToTime } from '../utils/time';

export const useDrag = (minTime: string, pixelsPerMinute: number): UseDragReturn => {
  const [dragStart, setDragStart] = useState<{ time: string; date: Date } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ time: string; date: Date } | null>(null);

  const handleDragStart = useCallback((e: React.MouseEvent, date: Date) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const time = pixelsToTime(y, minTime, pixelsPerMinute);
    setDragStart({ time, date });
  }, [minTime, pixelsPerMinute]);

  const handleDragEnd = useCallback((e: React.MouseEvent, date: Date) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const time = pixelsToTime(y, minTime, pixelsPerMinute);
    setDragEnd({ time, date });
  }, [minTime, pixelsPerMinute]);

  return { dragStart, dragEnd, handleDragStart, handleDragEnd };
};
