import { BookOpen, HelpCircle, Clock } from 'lucide-react';
import { useTimer } from '../../hooks/useTimer.ts';
import { useGameStore } from '../../store/gameStore.ts';
import { useUiStore } from '../../store/uiStore.ts';
import { getRoomById } from '../../data/rooms/index.ts';

export function GameHeader() {
  const { formatted } = useTimer();
  const currentRoomId = useGameStore((s) => s.currentRoomId);
  const hintsUsed = useGameStore((s) => s.hintsUsed);
  const totalHintsAvailable = useGameStore((s) => s.totalHintsAvailable);
  const toggleJournal = useUiStore((s) => s.toggleJournal);
  const journalOpen = useUiStore((s) => s.journalOpen);

  const room = getRoomById(currentRoomId);

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-gray-800/90 border-b border-gray-700 shrink-0">
      <div className="flex items-center gap-2 text-amber-400 font-bold">
        {room?.name ?? 'Escape Room'}
      </div>

      <div className="flex items-center gap-1 text-gray-300 font-mono">
        <Clock size={16} />
        <span>{formatted}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-gray-400 text-sm">
          <HelpCircle size={16} />
          <span>{totalHintsAvailable - hintsUsed} hints</span>
        </div>

        <button
          onClick={toggleJournal}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${
            journalOpen
              ? 'bg-amber-400 text-gray-900'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <BookOpen size={16} />
          Journal
        </button>
      </div>
    </header>
  );
}
