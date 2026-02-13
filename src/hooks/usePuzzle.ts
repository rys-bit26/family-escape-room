import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore.ts';
import { useJournalStore } from '../store/journalStore.ts';
import { useInventoryStore } from '../store/inventoryStore.ts';
import { getPuzzleById } from '../data/puzzles/index.ts';
import { validateSolution, getPuzzleDataForDifficulty, getMaxAttempts } from '../engine/puzzleEngine.ts';

export function usePuzzle(puzzleId: string) {
  const difficulty = useGameStore((s) => s.difficulty);
  const solvePuzzle = useGameStore((s) => s.solvePuzzle);
  const solvedPuzzleIds = useGameStore((s) => s.solvedPuzzleIds);
  const addEntry = useJournalStore((s) => s.addEntry);
  const pickupItem = useInventoryStore((s) => s.pickupItem);

  const puzzle = getPuzzleById(puzzleId);
  const isSolved = solvedPuzzleIds.includes(puzzleId);
  const data = puzzle ? getPuzzleDataForDifficulty(puzzle, difficulty) : null;
  const maxAttempts = puzzle ? getMaxAttempts(puzzle, difficulty) : 0;

  const attemptSolve = useCallback((attempt: unknown) => {
    if (!puzzle) return { correct: false, feedback: 'Puzzle not found.' };

    const result = validateSolution(puzzle, attempt, difficulty);

    if (result.correct) {
      solvePuzzle(puzzleId);

      if (puzzle.rewardClue) {
        addEntry({ text: puzzle.rewardClue, roomId: puzzle.roomId, puzzleId });
      }

      if (puzzle.rewardItemId) {
        pickupItem(puzzle.rewardItemId);
      }
    }

    return result;
  }, [puzzle, puzzleId, difficulty, solvePuzzle, addEntry, pickupItem]);

  return { puzzle, data, isSolved, attemptSolve, difficulty, maxAttempts };
}
