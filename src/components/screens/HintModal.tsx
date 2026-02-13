import { useState } from 'react';
import { Modal } from '../common/Modal.tsx';
import { useGameStore } from '../../store/gameStore.ts';
import { getPuzzlesForRoom } from '../../data/puzzles/index.ts';
import { getAvailableHint, getRevealedHints, getAutoHints } from '../../engine/hintEngine.ts';
import { Lightbulb, Lock, ChevronDown, ChevronUp } from 'lucide-react';

interface HintModalProps {
  onClose: () => void;
}

export function HintModal({ onClose }: HintModalProps) {
  const currentRoomId = useGameStore((s) => s.currentRoomId);
  const difficulty = useGameStore((s) => s.difficulty);
  const solvedPuzzleIds = useGameStore((s) => s.solvedPuzzleIds);
  const hintsUsed = useGameStore((s) => s.hintsUsed);
  const totalHintsAvailable = useGameStore((s) => s.totalHintsAvailable);
  const useHint = useGameStore((s) => s.useHint);

  const puzzles = getPuzzlesForRoom(currentRoomId);
  const unsolvedPuzzles = puzzles.filter(p => !solvedPuzzleIds.includes(p.id));
  const hintsRemaining = totalHintsAvailable - hintsUsed;

  // Track which hints have been revealed per puzzle (local state for this session)
  const [revealedTiers, setRevealedTiers] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    // Auto-reveal hints on easy mode
    for (const puzzle of unsolvedPuzzles) {
      const autoHints = getAutoHints(puzzle.hints, difficulty);
      initial[puzzle.id] = autoHints.length > 0 ? Math.max(...autoHints.map(h => h.tier)) : 0;
    }
    return initial;
  });

  const [expandedPuzzle, setExpandedPuzzle] = useState<string | null>(
    unsolvedPuzzles.length > 0 ? unsolvedPuzzles[0].id : null
  );

  function handleRevealHint(puzzleId: string) {
    if (hintsRemaining <= 0) return;

    const puzzle = unsolvedPuzzles.find(p => p.id === puzzleId);
    if (!puzzle) return;

    const currentTier = revealedTiers[puzzleId] ?? 0;
    const nextHint = getAvailableHint(puzzle.hints, currentTier, difficulty);
    if (!nextHint) return;

    useHint();
    setRevealedTiers(prev => ({
      ...prev,
      [puzzleId]: nextHint.tier,
    }));
  }

  return (
    <Modal onClose={onClose} title="Hints">
      <div className="flex flex-col gap-4">
        {/* Hint budget */}
        <div className="flex items-center justify-between bg-gray-900 rounded-lg px-4 py-2">
          <span className="text-gray-400 text-sm">Hints remaining</span>
          <span className="text-amber-400 font-bold font-mono text-lg">{hintsRemaining}</span>
        </div>

        {unsolvedPuzzles.length === 0 ? (
          <p className="text-green-400 text-center py-4">
            All puzzles in this room are solved! Great job!
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {unsolvedPuzzles.map(puzzle => {
              const currentTier = revealedTiers[puzzle.id] ?? 0;
              const revealed = getRevealedHints(puzzle.hints, currentTier);
              const nextHint = getAvailableHint(puzzle.hints, currentTier, difficulty);
              const isExpanded = expandedPuzzle === puzzle.id;

              return (
                <div key={puzzle.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                  {/* Puzzle header */}
                  <button
                    onClick={() => setExpandedPuzzle(isExpanded ? null : puzzle.id)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Lightbulb size={16} className="text-amber-400" />
                      <span className="text-gray-200 font-medium">{puzzle.name}</span>
                    </div>
                    {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 flex flex-col gap-3">
                      <p className="text-gray-400 text-sm italic">{puzzle.description}</p>

                      {/* Revealed hints */}
                      {revealed.length > 0 && (
                        <div className="flex flex-col gap-2">
                          {revealed.map(hint => (
                            <div key={hint.tier} className="flex items-start gap-2 bg-amber-400/10 rounded-lg px-3 py-2 border border-amber-400/20">
                              <Lightbulb size={14} className="text-amber-400 mt-0.5 shrink-0" />
                              <p className="text-amber-200 text-sm">{hint.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reveal next hint button */}
                      {nextHint ? (
                        <button
                          onClick={() => handleRevealHint(puzzle.id)}
                          disabled={hintsRemaining <= 0}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-gray-900 font-bold rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {hintsRemaining > 0 ? (
                            <>
                              <Lightbulb size={16} />
                              Reveal Hint (Tier {nextHint.tier})
                            </>
                          ) : (
                            <>
                              <Lock size={16} />
                              No hints remaining
                            </>
                          )}
                        </button>
                      ) : (
                        <p className="text-gray-500 text-sm text-center italic">
                          No more hints available for this puzzle.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
