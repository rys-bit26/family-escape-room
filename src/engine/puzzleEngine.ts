import type { PuzzleDefinition, PuzzleData } from '../types/puzzle.ts';
import type { DifficultyLevel } from '../types/game.ts';

export function getPuzzleDataForDifficulty(
  puzzle: PuzzleDefinition,
  difficulty: DifficultyLevel
): PuzzleData {
  const override = puzzle.difficultyOverrides?.[difficulty];
  return override ?? puzzle.data;
}

export function validateSolution(
  puzzle: PuzzleDefinition,
  attempt: unknown
): { correct: boolean; feedback?: string } {
  const solution = puzzle.solution;

  switch (solution.type) {
    case 'code':
      return {
        correct: String(attempt) === solution.code,
        feedback: String(attempt) === solution.code ? undefined : 'Incorrect code. Try again!',
      };

    case 'text': {
      const normalized = String(attempt).toLowerCase().trim();
      const correct = solution.answers.some(a => a.toLowerCase().trim() === normalized);
      return { correct, feedback: correct ? undefined : "That's not quite right. Try again!" };
    }

    case 'pattern': {
      const arr = attempt as string[];
      const correct = arr.length === solution.pattern.length
        && arr.every((v, i) => v === solution.pattern[i]);
      return { correct, feedback: correct ? undefined : 'The pattern is not correct.' };
    }

    case 'selection':
      return {
        correct: String(attempt) === solution.correctId,
        feedback: String(attempt) === solution.correctId ? undefined : "That's not the right choice.",
      };

    case 'sequence': {
      const seq = attempt as string[];
      const correct = seq.length === solution.sequence.length
        && seq.every((v, i) => v === solution.sequence[i]);
      return { correct, feedback: correct ? undefined : 'The sequence is not right.' };
    }

    case 'items': {
      const items = attempt as string[];
      const correct = solution.itemIds.length === items.length
        && solution.itemIds.every(id => items.includes(id));
      return { correct, feedback: correct ? undefined : 'You need different items.' };
    }

    default:
      return { correct: false, feedback: 'Unknown puzzle type.' };
  }
}
