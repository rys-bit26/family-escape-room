import type { PuzzleType } from '../../types/puzzle.ts';
import { CodePuzzle } from './CodePuzzle.tsx';
import { PatternPuzzle } from './PatternPuzzle.tsx';
import { RiddlePuzzle } from './RiddlePuzzle.tsx';
import { LogicPuzzle } from './LogicPuzzle.tsx';
import type { ComponentType } from 'react';

export interface PuzzleComponentProps {
  puzzleId: string;
  onClose: () => void;
}

const PUZZLE_COMPONENTS: Record<PuzzleType, ComponentType<PuzzleComponentProps>> = {
  code_entry: CodePuzzle,
  pattern_match: PatternPuzzle,
  riddle: RiddlePuzzle,
  logic_deduction: LogicPuzzle,
  hidden_sequence: PatternPuzzle,    // reuse pattern UI
  item_combination: CodePuzzle,      // placeholder
};

export function getPuzzleComponent(type: PuzzleType): ComponentType<PuzzleComponentProps> {
  return PUZZLE_COMPONENTS[type];
}
