import { useState, useMemo } from 'react';
import { usePuzzle } from '../../hooks/usePuzzle.ts';
import type { PatternMatchData } from '../../types/puzzle.ts';
import { AlertTriangle } from 'lucide-react';

interface PatternPuzzleProps {
  puzzleId: string;
  onClose: () => void;
}

const COLOR_CLASSES: Record<string, string> = {
  red: 'bg-red-500 hover:bg-red-400',
  blue: 'bg-blue-500 hover:bg-blue-400',
  green: 'bg-green-500 hover:bg-green-400',
  yellow: 'bg-yellow-400 hover:bg-yellow-300',
  purple: 'bg-purple-500 hover:bg-purple-400',
  orange: 'bg-orange-500 hover:bg-orange-400',
  pink: 'bg-pink-500 hover:bg-pink-400',
  cyan: 'bg-cyan-500 hover:bg-cyan-400',
};

const COLOR_DISPLAY: Record<string, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
  cyan: 'bg-cyan-500',
};

/** Fisher-Yates shuffle */
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function PatternPuzzle({ puzzleId, onClose }: PatternPuzzleProps) {
  const { puzzle, data, isSolved, attemptSolve, maxAttempts, difficulty } = usePuzzle(puzzleId);
  const [selectedPattern, setSelectedPattern] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState(isSolved);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  if (!puzzle || !data) return null;
  const patternData = data as PatternMatchData;
  const hasLimit = maxAttempts > 0;
  const attemptsLeft = hasLimit ? maxAttempts - attempts : Infinity;

  // Randomize the display order of symbols once per mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const shuffledSymbols = useMemo(() => shuffleArray(patternData.symbols), [puzzleId]);

  function handleSymbolClick(symbol: string) {
    if (solved || locked) return;

    const newPattern = [...selectedPattern, symbol];
    setSelectedPattern(newPattern);
    setFeedback(null);

    if (newPattern.length === patternData.gridSize) {
      const result = attemptSolve(newPattern);
      if (result.correct) {
        setSolved(true);
        setFeedback(puzzle!.rewardClue ?? 'Correct!');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (hasLimit && newAttempts >= maxAttempts) {
          setLocked(true);
          setFeedback('The panel locks up! Wait for it to reset...');
          setTimeout(() => {
            setLocked(false);
            setAttempts(Math.max(0, maxAttempts - 2));
            setFeedback('The panel resets. Try again carefully.');
            setSelectedPattern([]);
          }, difficulty === 'hard' ? 8000 : 5000);
        } else if (hasLimit && maxAttempts - newAttempts <= 2) {
          setFeedback(`Wrong! Only ${maxAttempts - newAttempts} attempt${maxAttempts - newAttempts === 1 ? '' : 's'} left!`);
          setTimeout(() => setSelectedPattern([]), 800);
        } else {
          setFeedback(result.feedback ?? 'Try again.');
          setTimeout(() => setSelectedPattern([]), 800);
        }
      }
    }
  }

  function handleClear() {
    setSelectedPattern([]);
    setFeedback(null);
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

      {/* Selected pattern display */}
      <div className="flex gap-2 min-h-[3rem] items-center">
        {Array.from({ length: patternData.gridSize }).map((_, i) => (
          <div
            key={i}
            className={`w-12 h-12 rounded-lg border-2 border-gray-600 transition-colors ${
              selectedPattern[i]
                ? COLOR_DISPLAY[selectedPattern[i]] ?? 'bg-gray-500'
                : 'bg-gray-800'
            }`}
          />
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
          {/* Available symbols — shuffled each game */}
          <div className="flex gap-3 flex-wrap justify-center">
            {shuffledSymbols.map((symbol) => (
              <button
                key={symbol}
                onClick={() => handleSymbolClick(symbol)}
                disabled={locked}
                className={`w-14 h-14 rounded-lg ${COLOR_CLASSES[symbol] ?? 'bg-gray-500 hover:bg-gray-400'} transition-colors text-white font-bold text-xs capitalize disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {symbol}
              </button>
            ))}
          </div>

          <button
            onClick={handleClear}
            disabled={locked}
            className="text-sm text-gray-400 hover:text-white underline disabled:opacity-40"
          >
            Clear Pattern
          </button>

          {feedback && (
            <p className={`text-sm text-center animate-pulse ${locked ? 'text-orange-400' : 'text-red-400'}`}>
              {feedback}
            </p>
          )}
          {locked && (
            <div className="text-orange-400 text-xs">Panel is locked — please wait...</div>
          )}
        </>
      )}
    </div>
  );
}
