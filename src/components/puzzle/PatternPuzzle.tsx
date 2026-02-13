import { useState } from 'react';
import { usePuzzle } from '../../hooks/usePuzzle.ts';
import type { PatternMatchData } from '../../types/puzzle.ts';

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
};

const COLOR_DISPLAY: Record<string, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
};

export function PatternPuzzle({ puzzleId, onClose }: PatternPuzzleProps) {
  const { puzzle, data, isSolved, attemptSolve } = usePuzzle(puzzleId);
  const [selectedPattern, setSelectedPattern] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState(isSolved);

  if (!puzzle || !data) return null;
  const patternData = data as PatternMatchData;

  function handleSymbolClick(symbol: string) {
    if (solved) return;

    const newPattern = [...selectedPattern, symbol];
    setSelectedPattern(newPattern);
    setFeedback(null);

    if (newPattern.length === patternData.gridSize) {
      const result = attemptSolve(newPattern);
      if (result.correct) {
        setSolved(true);
        setFeedback(puzzle!.rewardClue ?? 'Correct!');
      } else {
        setFeedback(result.feedback ?? 'Try again.');
        setTimeout(() => setSelectedPattern([]), 800);
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

      {/* Selected pattern display */}
      <div className="flex gap-2 min-h-[3rem] items-center">
        {Array.from({ length: patternData.gridSize }).map((_, i) => (
          <div
            key={i}
            className={`w-12 h-12 rounded-lg border-2 border-gray-600 ${
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
          {/* Available symbols */}
          <div className="flex gap-3 flex-wrap justify-center">
            {patternData.symbols.map((symbol) => (
              <button
                key={symbol}
                onClick={() => handleSymbolClick(symbol)}
                className={`w-14 h-14 rounded-lg ${COLOR_CLASSES[symbol] ?? 'bg-gray-500 hover:bg-gray-400'} transition-colors text-white font-bold text-xs capitalize`}
              >
                {symbol}
              </button>
            ))}
          </div>

          <button
            onClick={handleClear}
            className="text-sm text-gray-400 hover:text-white underline"
          >
            Clear Pattern
          </button>

          {feedback && (
            <p className="text-red-400 text-sm animate-pulse">{feedback}</p>
          )}
        </>
      )}
    </div>
  );
}
