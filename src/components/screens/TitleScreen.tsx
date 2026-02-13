import { useState } from 'react';
import { useNavigate } from 'react-router';
import { DifficultySelector } from '../layout/DifficultySelector.tsx';
import { useGameStore } from '../../store/gameStore.ts';
import { useInventoryStore } from '../../store/inventoryStore.ts';
import { useJournalStore } from '../../store/journalStore.ts';
import { getAllRooms } from '../../data/rooms/index.ts';
import type { DifficultyLevel } from '../../types/game.ts';
import { BookOpen, Gamepad2, Rocket, Music } from 'lucide-react';

const ROOM_ICONS: Record<string, typeof BookOpen> = {
  library: BookOpen,
  arcade: Gamepad2,
  'space-station': Rocket,
  'concert-hall': Music,
};

const ROOM_COLORS: Record<string, string> = {
  library: 'from-amber-600 to-amber-800',
  arcade: 'from-pink-600 to-purple-800',
  'space-station': 'from-blue-600 to-indigo-800',
  'concert-hall': 'from-red-600 to-rose-800',
};

const ROOM_BORDER_COLORS: Record<string, string> = {
  library: 'border-amber-500 ring-amber-400',
  arcade: 'border-pink-500 ring-pink-400',
  'space-station': 'border-blue-500 ring-blue-400',
  'concert-hall': 'border-red-500 ring-red-400',
};

export function TitleScreen() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const startNewGame = useGameStore((s) => s.startNewGame);
  const gameStatus = useGameStore((s) => s.status);
  const resetGame = useGameStore((s) => s.resetGame);
  const resetInventory = useInventoryStore((s) => s.reset);
  const resetJournal = useJournalStore((s) => s.reset);
  const navigate = useNavigate();

  const rooms = getAllRooms();
  const hasExistingGame = gameStatus === 'in_progress';

  function handleNewGame() {
    if (!selectedRoomId) return;
    resetGame();
    resetInventory();
    resetJournal();
    startNewGame(difficulty, selectedRoomId);
    navigate('/game');
  }

  function handleContinue() {
    navigate('/game');
  }

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-y-auto py-8">
      <div className="flex flex-col items-center gap-6 max-w-lg w-full">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-amber-400 mb-2">
            Escape Room
          </h1>
          <p className="text-gray-400 text-lg">A Family Puzzle Adventure</p>
        </div>

        {hasExistingGame && (
          <button
            onClick={handleContinue}
            className="w-full px-8 py-4 bg-amber-500 text-gray-900 font-bold text-lg rounded-xl hover:bg-amber-400 transition-colors"
          >
            Continue Game
          </button>
        )}

        {hasExistingGame && (
          <div className="w-full border-t border-gray-700 pt-2">
            <p className="text-gray-500 text-sm text-center mb-3">Or start a new game:</p>
          </div>
        )}

        {/* Room Selection */}
        <div className="w-full">
          <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-3 text-center">
            Choose a Room
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {rooms.map((room) => {
              const Icon = ROOM_ICONS[room.id] ?? BookOpen;
              const gradient = ROOM_COLORS[room.id] ?? 'from-gray-600 to-gray-800';
              const borderColor = ROOM_BORDER_COLORS[room.id] ?? 'border-gray-500 ring-gray-400';
              const isSelected = selectedRoomId === room.id;
              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all bg-gradient-to-br ${gradient} ${
                    isSelected
                      ? `${borderColor} ring-2 scale-[1.02]`
                      : 'border-transparent opacity-70 hover:opacity-100 hover:scale-[1.01]'
                  }`}
                >
                  <Icon size={32} className="text-white" />
                  <span className="text-white font-bold text-sm text-center leading-tight">{room.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="w-full">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>

        {/* Start Button */}
        <button
          onClick={handleNewGame}
          disabled={!selectedRoomId}
          className="w-full px-8 py-4 bg-amber-500 text-gray-900 font-bold text-lg rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {selectedRoomId ? 'Start Game' : 'Select a Room to Begin'}
        </button>
      </div>
    </div>
  );
}
