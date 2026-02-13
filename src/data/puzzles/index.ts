import type { PuzzleDefinition } from '../../types/puzzle.ts';
import { libraryPuzzles } from './library-puzzles.ts';

const ALL_PUZZLES: PuzzleDefinition[] = [
  ...libraryPuzzles,
];

export function getPuzzleById(id: string): PuzzleDefinition | undefined {
  return ALL_PUZZLES.find(p => p.id === id);
}

export function getPuzzlesForRoom(roomId: string): PuzzleDefinition[] {
  return ALL_PUZZLES.filter(p => p.roomId === roomId);
}
