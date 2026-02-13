import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore.ts';

export function useTimer() {
  const status = useGameStore((s) => s.status);
  const startedAt = useGameStore((s) => s.startedAt);
  const elapsedSeconds = useGameStore((s) => s.elapsedSeconds);
  const updateElapsedTime = useGameStore((s) => s.updateElapsedTime);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === 'in_progress' && startedAt) {
      intervalRef.current = window.setInterval(() => {
        const totalElapsed = Math.floor((Date.now() - startedAt) / 1000);
        updateElapsedTime(totalElapsed);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, startedAt, updateElapsedTime]);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return { elapsedSeconds, formatted };
}
