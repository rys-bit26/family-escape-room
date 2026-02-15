export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type GameStatus = 'not_started' | 'in_progress' | 'completed';

export type GameMode = 'campaign' | 'freeplay';

export interface GameState {
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
}
