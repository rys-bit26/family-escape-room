import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DifficultyLevel, GameStatus } from '../types/game.ts';

interface GameStore {
  id: string;
  status: GameStatus;
  difficulty: DifficultyLevel;
  currentRoomId: string;
  unlockedRoomIds: string[];
  solvedPuzzleIds: string[];
  discoveredObjectIds: string[];
  startedAt: number | null;
  completedAt: number | null;
  elapsedSeconds: number;
  hintsUsed: number;
  totalHintsAvailable: number;

  startNewGame: (difficulty: DifficultyLevel, firstRoomId: string) => void;
  solvePuzzle: (puzzleId: string) => void;
  discoverObject: (objectId: string) => void;
  unlockRoom: (roomId: string) => void;
  moveToRoom: (roomId: string) => void;
  useHint: () => void;
  updateElapsedTime: (seconds: number) => void;
  completeGame: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      id: '',
      status: 'not_started',
      difficulty: 'medium',
      currentRoomId: '',
      unlockedRoomIds: [],
      solvedPuzzleIds: [],
      discoveredObjectIds: [],
      startedAt: null,
      completedAt: null,
      elapsedSeconds: 0,
      hintsUsed: 0,
      totalHintsAvailable: 10,

      startNewGame: (difficulty, firstRoomId) => set({
        id: crypto.randomUUID(),
        status: 'in_progress',
        difficulty,
        currentRoomId: firstRoomId,
        unlockedRoomIds: [firstRoomId],
        solvedPuzzleIds: [],
        discoveredObjectIds: [],
        startedAt: Date.now(),
        completedAt: null,
        elapsedSeconds: 0,
        hintsUsed: 0,
        totalHintsAvailable: difficulty === 'easy' ? 15 : difficulty === 'medium' ? 10 : 5,
      }),

      solvePuzzle: (puzzleId) => set((state) => ({
        solvedPuzzleIds: [...new Set([...state.solvedPuzzleIds, puzzleId])],
      })),

      discoverObject: (objectId) => set((state) => ({
        discoveredObjectIds: [...new Set([...state.discoveredObjectIds, objectId])],
      })),

      unlockRoom: (roomId) => set((state) => ({
        unlockedRoomIds: [...new Set([...state.unlockedRoomIds, roomId])],
      })),

      moveToRoom: (roomId) => set({ currentRoomId: roomId }),

      useHint: () => set((state) => ({
        hintsUsed: state.hintsUsed + 1,
      })),

      updateElapsedTime: (seconds) => set({ elapsedSeconds: seconds }),

      completeGame: () => set({
        status: 'completed',
        completedAt: Date.now(),
      }),

      resetGame: () => set({
        id: '',
        status: 'not_started',
        difficulty: 'medium',
        currentRoomId: '',
        unlockedRoomIds: [],
        solvedPuzzleIds: [],
        discoveredObjectIds: [],
        startedAt: null,
        completedAt: null,
        elapsedSeconds: 0,
        hintsUsed: 0,
        totalHintsAvailable: 10,
      }),
    }),
    {
      name: 'family-escape-room-game',
      version: 1,
    }
  )
);
