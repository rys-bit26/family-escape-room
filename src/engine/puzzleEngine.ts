import type { PuzzleDefinition, PuzzleData, CodeEntryData, PatternMatchData, RiddleData } from '../types/puzzle.ts';
import type { DifficultyLevel } from '../types/game.ts';

export function getPuzzleDataForDifficulty(
  puzzle: PuzzleDefinition,
  difficulty: DifficultyLevel
): PuzzleData {
  const override = puzzle.difficultyOverrides?.[difficulty];
  return override ?? puzzle.data;
}

/**
 * Returns the max attempts for a puzzle at a given difficulty.
 * 0 means unlimited.
 */
export function getMaxAttempts(
  puzzle: PuzzleDefinition,
  difficulty: DifficultyLevel
): number {
  return puzzle.maxAttempts?.[difficulty] ?? 0;
}

/**
 * Validates a player's attempt against the puzzle data for the current difficulty.
 * Uses the difficulty-specific data (which may have different codes/patterns)
 * rather than the base solution.
 */
export function validateSolution(
  puzzle: PuzzleDefinition,
  attempt: unknown,
  difficulty: DifficultyLevel = 'medium'
): { correct: boolean; feedback?: string } {
  const data = getPuzzleDataForDifficulty(puzzle, difficulty);

  switch (data.type) {
    case 'code_entry': {
      const codeData = data as CodeEntryData;
      const correct = String(attempt) === codeData.correctCode;
      return { correct, feedback: correct ? undefined : 'Incorrect code. Try again!' };
    }

    case 'riddle': {
      const riddleData = data as RiddleData;
      const normalized = String(attempt).toLowerCase().trim();
      const correct = riddleData.acceptableAnswers.some(a => a.toLowerCase().trim() === normalized);
      return { correct, feedback: correct ? undefined : "That's not quite right. Try again!" };
    }

    case 'pattern_match': {
      const patternData = data as PatternMatchData;
      const arr = attempt as string[];
      const correct = arr.length === patternData.correctPattern.length
        && arr.every((v, i) => v === patternData.correctPattern[i]);
      return { correct, feedback: correct ? undefined : 'The pattern is not correct.' };
    }

    case 'logic_deduction': {
      const solution = puzzle.solution;
      if (solution.type === 'selection') {
        return {
          correct: String(attempt) === solution.correctId,
          feedback: String(attempt) === solution.correctId ? undefined : "That's not the right choice.",
        };
      }
      return { correct: false, feedback: 'Unknown solution type.' };
    }

    case 'hidden_sequence': {
      const solution = puzzle.solution;
      if (solution.type === 'sequence') {
        const seq = attempt as string[];
        const correct = seq.length === solution.sequence.length
          && seq.every((v, i) => v === solution.sequence[i]);
        return { correct, feedback: correct ? undefined : 'The sequence is not right.' };
      }
      return { correct: false, feedback: 'Unknown solution type.' };
    }

    case 'item_combination': {
      const solution = puzzle.solution;
      if (solution.type === 'items') {
        const items = attempt as string[];
        const correct = solution.itemIds.length === items.length
          && solution.itemIds.every(id => items.includes(id));
        return { correct, feedback: correct ? undefined : 'You need different items.' };
      }
      return { correct: false, feedback: 'Unknown solution type.' };
    }

    default:
      return { correct: false, feedback: 'Unknown puzzle type.' };
  }
}
