import { useState } from 'react';
import { CodeInput } from '../common/CodeInput.tsx';
import { usePuzzle } from '../../hooks/usePuzzle.ts';
import type { CodeEntryData } from '../../types/puzzle.ts';

interface CodePuzzleProps {
  puzzleId: string;
  onClose: () => void;
}

export function CodePuzzle({ puzzleId, onClose }: CodePuzzleProps) {
  const { puzzle, data, isSolved, attemptSolve } = usePuzzle(puzzleId);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState(isSolved);

  if (!puzzle || !data) return null;
  const codeData = data as CodeEntryData;

  function handleSubmit(code: string) {
    const result = attemptSolve(code);
    if (result.correct) {
      setSolved(true);
      setFeedback(puzzle!.rewardClue ?? 'Correct!');
    } else {
      setFeedback(result.feedback ?? 'Try again.');
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-gray-300 text-center">{puzzle.description}</p>
      <p className="text-amber-400/80 text-sm italic text-center">{codeData.clueText}</p>

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
          <CodeInput length={codeData.codeLength} onSubmit={handleSubmit} />
          {feedback && (
            <p className="text-red-400 text-sm animate-pulse">{feedback}</p>
          )}
        </>
      )}
    </div>
  );
}
