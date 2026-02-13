import { useState } from 'react';
import { usePuzzle } from '../../hooks/usePuzzle.ts';
import type { RiddleData } from '../../types/puzzle.ts';

interface RiddlePuzzleProps {
  puzzleId: string;
  onClose: () => void;
}

export function RiddlePuzzle({ puzzleId, onClose }: RiddlePuzzleProps) {
  const { puzzle, data, isSolved, attemptSolve } = usePuzzle(puzzleId);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState(isSolved);

  if (!puzzle || !data) return null;
  const riddleData = data as RiddleData;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim()) return;

    const result = attemptSolve(answer);
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

      <div className="bg-gray-900 rounded-lg p-6 border border-amber-400/30 w-full">
        <p className="text-amber-300 text-lg text-center italic whitespace-pre-line">
          {riddleData.riddleText}
        </p>
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
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer..."
            className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-600 rounded-lg text-white text-lg focus:border-amber-400 focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="px-6 py-2 bg-amber-500 text-gray-900 font-bold rounded-lg hover:bg-amber-400 transition-colors"
          >
            Submit Answer
          </button>
          {feedback && (
            <p className="text-red-400 text-sm text-center animate-pulse">{feedback}</p>
          )}
        </form>
      )}
    </div>
  );
}
