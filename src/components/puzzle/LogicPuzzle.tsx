import { useState } from 'react';
import { usePuzzle } from '../../hooks/usePuzzle.ts';
import type { LogicDeductionData } from '../../types/puzzle.ts';
import { AlertTriangle } from 'lucide-react';

interface LogicPuzzleProps {
  puzzleId: string;
  onClose: () => void;
}

export function LogicPuzzle({ puzzleId, onClose }: LogicPuzzleProps) {
  const { puzzle, data, isSolved, attemptSolve, maxAttempts, difficulty } = usePuzzle(puzzleId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState(isSolved);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  if (!puzzle || !data) return null;
  const logicData = data as LogicDeductionData;
  const hasLimit = maxAttempts > 0;
  const attemptsLeft = hasLimit ? maxAttempts - attempts : Infinity;

  function handleSubmit() {
    if (!selectedId || locked) return;

    const result = attemptSolve(selectedId);
    if (result.correct) {
      setSolved(true);
      setFeedback(puzzle!.rewardClue ?? 'Correct!');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (hasLimit && newAttempts >= maxAttempts) {
        setLocked(true);
        setFeedback('Too many wrong guesses! Wait a moment...');
        setTimeout(() => {
          setLocked(false);
          setAttempts(Math.max(0, maxAttempts - 2));
          setFeedback('You can try again now.');
          setSelectedId(null);
        }, difficulty === 'hard' ? 8000 : 5000);
      } else if (hasLimit && maxAttempts - newAttempts <= 2) {
        setFeedback(`Wrong! Only ${maxAttempts - newAttempts} attempt${maxAttempts - newAttempts === 1 ? '' : 's'} left!`);
      } else {
        setFeedback(result.feedback ?? "That's not right. Try again.");
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-gray-300 text-center">{puzzle.description}</p>

      {/* Attempt counter */}
      {hasLimit && !solved && (
        <div className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full ${
          attemptsLeft <= 2 ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-400'
        }`}>
          {attemptsLeft <= 2 && <AlertTriangle size={14} />}
          <span>{attemptsLeft} attempt{attemptsLeft === 1 ? '' : 's'} remaining</span>
        </div>
      )}

      {/* Clues */}
      <div className="bg-gray-900 rounded-lg p-4 border border-amber-400/30 w-full space-y-2">
        {logicData.clues.map((clue, i) => (
          <p key={i} className="text-amber-300 text-sm italic">
            {i + 1}. {clue}
          </p>
        ))}
      </div>

      {solved ? (
        <div className="text-center">
          <div className="text-green-400 text-lg font-bold mb-3">Solved!</div>
          {feedback && <p className="text-gray-300">{feedback}</p>}
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-amber-500 text-gray-900 font-bold rounded-lg hover:bg-amber-400 transition-colors"
          >
            Continue
          </button>
        </div>
      ) : (
        <>
          {/* Options */}
          <div className="w-full space-y-2">
            {logicData.options.map((option) => (
              <button
                key={option.id}
                onClick={() => !locked && setSelectedId(option.id)}
                disabled={locked}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                  selectedId === option.id
                    ? 'border-amber-400 bg-amber-400/10 text-white'
                    : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={locked || !selectedId}
            className="px-6 py-2 bg-amber-500 text-gray-900 font-bold rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>

          {feedback && (
            <p className={`text-sm text-center animate-pulse ${locked ? 'text-orange-400' : 'text-red-400'}`}>
              {feedback}
            </p>
          )}
          {locked && (
            <div className="text-orange-400 text-xs text-center">Please wait...</div>
          )}
        </>
      )}
    </div>
  );
}
