import type { HintDefinition } from '../types/puzzle.ts';
import type { DifficultyLevel } from '../types/game.ts';

export function getAvailableHint(
  hints: HintDefinition[],
  revealedTier: number,
  _difficulty: DifficultyLevel
): HintDefinition | null {
  const nextTier = revealedTier + 1;
  const hint = hints.find(h => h.tier === nextTier);
  return hint ?? null;
}

export function getAutoHints(
  hints: HintDefinition[],
  difficulty: DifficultyLevel
): HintDefinition[] {
  if (difficulty !== 'easy') return [];
  return hints.filter(h => h.autoShowOnEasy);
}

export function getRevealedHints(
  hints: HintDefinition[],
  revealedTier: number
): HintDefinition[] {
  return hints.filter(h => h.tier <= revealedTier).sort((a, b) => a.tier - b.tier);
}
