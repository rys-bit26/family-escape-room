import { useState } from 'react';
import { usePuzzle } from '../../hooks/usePuzzle.ts';
import type { RiddleData } from '../../types/puzzle.ts';
import { AlertTriangle } from 'lucide-react';

interface RiddlePuzzleProps {
  puzzleId: string;
  onClose: () => void;
}

export function RiddlePuzzle({ puzzleId, onClose }: RiddlePuzzleProps) {
  const { puzzle, data, isSolved, attemptSolve, maxAttempts, difficulty } = usePuzzle(puzzleId);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState(isSolved);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  if (!puzzle || !data) return null;
  const riddleData = data as RiddleData;
  const hasLimit = maxAttempts > 0;
  const attemptsLeft = hasLimit ? maxAttempts - attempts : Infinity;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim() || locked) return;

    const result = attemptSolve(answer);
    if (result.correct) {
      setSolved(true);
      setFeedback(puzzle!.rewardClue ?? 'Correct!');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (hasLimit && newAttempts >= maxAttempts) {
        setLocked(true);
        setFeedback('The inscription fades! Wait for it to reappear...');
        setTimeout(() => {
          setLocked(false);
          setAttempts(Math.max(0, maxAttempts - 2));
          setFeedback('The riddle glows again. Think carefully.');
          setAnswer('');
        }, difficulty === 'hard' ? 8000 : 5000);
      } else if (hasLimit && maxAttempts - newAttempts <= 2) {
        setFeedback(`Wrong! Only ${maxAttempts - newAttempts} attempt${maxAttempts - newAttempts === 1 ? '' : 's'} left!`);
        setAnswer('');
      } else {
        setFeedback(result.feedback ?? 'Try again.');
        setAnswer('');
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

      <div className={`bg-gray-900 rounded-lg p-6 border border-amber-400/30 w-full transition-opacity ${locked ? 'opacity-30' : ''}`}>
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
            disabled={locked}
            className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-600 rounded-lg text-white text-lg focus:border-amber-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            autoFocus
          />
          <button
            type="submit"
            disabled={locked}
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
            <div className="text-orange-400 text-xs text-center">The riddle is fading — please wait...</div>
          )}
        </form>
      )}
    </div>
  );
}
