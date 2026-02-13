import { useState } from 'react';
import { useNavigate } from 'react-router';
import { DifficultySelector } from '../layout/DifficultySelector.tsx';
import { useGameStore } from '../../store/gameStore.ts';
import { useInventoryStore } from '../../store/inventoryStore.ts';
import { useJournalStore } from '../../store/journalStore.ts';
import { getFirstRoomId } from '../../data/rooms/index.ts';
import type { DifficultyLevel } from '../../types/game.ts';

export function TitleScreen() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const startNewGame = useGameStore((s) => s.startNewGame);
  const gameStatus = useGameStore((s) => s.status);
  const resetGame = useGameStore((s) => s.resetGame);
  const resetInventory = useInventoryStore((s) => s.reset);
  const resetJournal = useJournalStore((s) => s.reset);
  const navigate = useNavigate();

  const hasExistingGame = gameStatus === 'in_progress';

  function handleNewGame() {
    resetGame();
    resetInventory();
    resetJournal();
    startNewGame(difficulty, getFirstRoomId());
    navigate('/game');
  }

  function handleContinue() {
    navigate('/game');
  }

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="flex flex-col items-center gap-8 max-w-md w-full">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-amber-400 mb-2">
            Escape Room
          </h1>
          <p className="text-gray-400 text-lg">A Family Puzzle Adventure</p>
        </div>

        {/* Key icon decoration */}
        <div className="text-6xl">
          🔐
        </div>

        {hasExistingGame ? (
          <div className="flex flex-col items-center gap-4 w-full">
            <button
              onClick={handleContinue}
              className="w-full px-8 py-4 bg-amber-500 text-gray-900 font-bold text-lg rounded-xl hover:bg-amber-400 transition-colors"
            >
              Continue Game
            </button>
            <div className="w-full border-t border-gray-700 pt-4">
              <p className="text-gray-500 text-sm text-center mb-3">Or start fresh:</p>
              <DifficultySelector selected={difficulty} onChange={setDifficulty} />
              <button
                onClick={handleNewGame}
                className="w-full mt-4 px-8 py-3 bg-gray-700 text-gray-200 font-bold rounded-xl hover:bg-gray-600 transition-colors"
              >
                New Game
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 w-full">
            <DifficultySelector selected={difficulty} onChange={setDifficulty} />
            <button
              onClick={handleNewGame}
              className="w-full px-8 py-4 bg-amber-500 text-gray-900 font-bold text-lg rounded-xl hover:bg-amber-400 transition-colors"
            >
              Start Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
