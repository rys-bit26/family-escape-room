import type { PuzzleDefinition } from '../../types/puzzle.ts';
import { libraryPuzzles } from './library-puzzles.ts';
import { arcadePuzzles } from './arcade-puzzles.ts';
import { spaceStationPuzzles } from './space-station-puzzles.ts';
import { concertHallPuzzles } from './concert-hall-puzzles.ts';

const ALL_PUZZLES: PuzzleDefinition[] = [
  ...libraryPuzzles,
  ...arcadePuzzles,
  ...spaceStationPuzzles,
  ...concertHallPuzzles,
];

export function getPuzzleById(id: string): PuzzleDefinition | undefined {
  return ALL_PUZZLES.find(p => p.id === id);
}

export function getPuzzlesForRoom(roomId: string): PuzzleDefinition[] {
  return ALL_PUZZLES.filter(p => p.roomId === roomId);
}
