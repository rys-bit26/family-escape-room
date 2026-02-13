import { BookOpen, Lightbulb, Clock } from 'lucide-react';
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
  const hintModalOpen = useUiStore((s) => s.hintModalOpen);
  const toggleHintModal = useUiStore((s) => s.toggleHintModal);

  const room = getRoomById(currentRoomId);
  const hintsRemaining = totalHintsAvailable - hintsUsed;

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-gray-800/90 border-b border-gray-700 shrink-0">
      <div className="flex items-center gap-2 text-amber-400 font-bold">
        {room?.name ?? 'Escape Room'}
      </div>

      <div className="flex items-center gap-1 text-gray-300 font-mono">
        <Clock size={16} />
        <span>{formatted}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleHintModal}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${
            hintModalOpen
              ? 'bg-amber-400 text-gray-900'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <Lightbulb size={16} />
          <span>{hintsRemaining} hints</span>
        </button>

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
