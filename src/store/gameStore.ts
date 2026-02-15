import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DifficultyLevel, GameStatus, GameMode } from '../types/game.ts';

interface GameStore {
  id: string;
  status: GameStatus;
  difficulty: DifficultyLevel;
  mode: GameMode;
  currentRoomId: string;
  unlockedRoomIds: string[];
  solvedPuzzleIds: string[];
  discoveredObjectIds: string[];
  startedAt: number | null;
  completedAt: number | null;
  elapsedSeconds: number;
  hintsUsed: number;
  totalHintsAvailable: number;
  showRoomComplete: boolean;
  completedRoomId: string | null;
  storyIntroSeen: boolean;

  startNewGame: (difficulty: DifficultyLevel, firstRoomId: string, mode: GameMode) => void;
  solvePuzzle: (puzzleId: string) => void;
  discoverObject: (objectId: string) => void;
  unlockRoom: (roomId: string) => void;
  moveToRoom: (roomId: string) => void;
  useHint: () => void;
  updateElapsedTime: (seconds: number) => void;
  completeGame: () => void;
  resetGame: () => void;
  setRoomCompleteVisible: (roomId: string | null) => void;
  setStoryIntroSeen: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      id: '',
      status: 'not_started',
      difficulty: 'medium',
      mode: 'freeplay',
      currentRoomId: '',
      unlockedRoomIds: [],
      solvedPuzzleIds: [],
      discoveredObjectIds: [],
      startedAt: null,
      completedAt: null,
      elapsedSeconds: 0,
      hintsUsed: 0,
      totalHintsAvailable: 10,
      showRoomComplete: false,
      completedRoomId: null,
      storyIntroSeen: false,

      startNewGame: (difficulty, firstRoomId, mode) => set({
        id: crypto.randomUUID(),
        status: 'in_progress',
        difficulty,
        mode,
        currentRoomId: firstRoomId,
        unlockedRoomIds: [firstRoomId],
        solvedPuzzleIds: [],
        discoveredObjectIds: [],
        startedAt: Date.now(),
        completedAt: null,
        elapsedSeconds: 0,
        hintsUsed: 0,
        totalHintsAvailable: difficulty === 'easy' ? 15 : difficulty === 'medium' ? 10 : 5,
        showRoomComplete: false,
        completedRoomId: null,
        storyIntroSeen: false,
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
        mode: 'freeplay',
        currentRoomId: '',
        unlockedRoomIds: [],
        solvedPuzzleIds: [],
        discoveredObjectIds: [],
        startedAt: null,
        completedAt: null,
        elapsedSeconds: 0,
        hintsUsed: 0,
        totalHintsAvailable: 10,
        showRoomComplete: false,
        completedRoomId: null,
        storyIntroSeen: false,
      }),

      setRoomCompleteVisible: (roomId) => set({
        showRoomComplete: roomId !== null,
        completedRoomId: roomId,
      }),

      setStoryIntroSeen: () => set({ storyIntroSeen: true }),
    }),
    {
      name: 'family-escape-room-game',
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        if (version < 2) {
          const state = persisted as Record<string, unknown>;
          return { ...state, mode: 'freeplay', showRoomComplete: false, completedRoomId: null, storyIntroSeen: false };
        }
        return persisted;
      },
    }
  )
);
