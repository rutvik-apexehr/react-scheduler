import { useState, useCallback } from 'react';
import { UseZoomReturn } from '../types';

export const useZoom = (initialStep: number = 30): UseZoomReturn => {
  const [timeStep, setTimeStep] = useState(initialStep);

  const handleZoom = useCallback((event: WheelEvent) => {
    if (event.ctrlKey) {
      event.preventDefault();
      setTimeStep(prev => {
        const newStep = event.deltaY < 0 ? prev + 15 : prev - 15;
        return Math.max(15, Math.min(60, newStep));
      });
    }
  }, []);

  return { timeStep, setTimeStep, handleZoom };
};
