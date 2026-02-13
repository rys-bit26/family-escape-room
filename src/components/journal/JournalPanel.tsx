import { X, BookOpen } from 'lucide-react';
import { useJournalStore } from '../../store/journalStore.ts';
import { useUiStore } from '../../store/uiStore.ts';

export function JournalPanel() {
  const entries = useJournalStore((s) => s.entries);
  const toggleJournal = useUiStore((s) => s.toggleJournal);

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-800/95 border-l border-gray-700 z-40 flex flex-col shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <BookOpen size={18} />
          Journal
        </div>
        <button onClick={toggleJournal} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {entries.length === 0 ? (
          <p className="text-gray-500 text-sm italic text-center mt-8">
            No clues discovered yet. Explore the room!
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-gray-900/50 rounded-lg p-3 border border-gray-700"
              >
                <p className="text-gray-200 text-sm">{entry.text}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(entry.discoveredAt).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
