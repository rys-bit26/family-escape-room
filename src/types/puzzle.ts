import type { DifficultyLevel } from './game.ts';

export type PuzzleType =
  | 'pattern_match'
  | 'code_entry'
  | 'riddle'
  | 'logic_deduction'
  | 'hidden_sequence'
  | 'item_combination';

export interface PuzzleDefinition {
  id: string;
  roomId: string;
  type: PuzzleType;
  name: string;
  description: string;
  difficultyOverrides?: Partial<Record<DifficultyLevel, PuzzleData>>;
  data: PuzzleData;
  solution: PuzzleSolution;
  hints: HintDefinition[];
  rewardClue?: string;
  rewardItemId?: string;
}

export type PuzzleData =
  | PatternMatchData
  | CodeEntryData
  | RiddleData
  | LogicDeductionData
  | HiddenSequenceData
  | ItemCombinationData;

export interface PatternMatchData {
  type: 'pattern_match';
  symbols: string[];
  gridSize: number;
  correctPattern: string[];
}

export interface CodeEntryData {
  type: 'code_entry';
  codeLength: number;
  correctCode: string;
  clueText: string;
}

export interface RiddleData {
  type: 'riddle';
  riddleText: string;
  acceptableAnswers: string[];
}

export interface LogicDeductionData {
  type: 'logic_deduction';
  clues: string[];
  options: LogicOption[];
  correctOptionId: string;
}

export interface LogicOption {
  id: string;
  label: string;
}

export interface HiddenSequenceData {
  type: 'hidden_sequence';
  sequence: string[];
  scrambledDisplay: string[];
}

export interface ItemCombinationData {
  type: 'item_combination';
  requiredItems: string[];
  resultItemId: string;
}

export type PuzzleSolution =
  | { type: 'pattern'; pattern: string[] }
  | { type: 'code'; code: string }
  | { type: 'text'; answers: string[] }
  | { type: 'selection'; correctId: string }
  | { type: 'sequence'; sequence: string[] }
  | { type: 'items'; itemIds: string[] };

export interface HintDefinition {
  tier: number;
  text: string;
  autoShowOnEasy?: boolean;
}
