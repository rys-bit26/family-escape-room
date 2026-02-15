import { useState } from 'react';
import { usePuzzle } from '../../hooks/usePuzzle.ts';
import type { HiddenSequenceData } from '../../types/puzzle.ts';
import { AlertTriangle, X } from 'lucide-react';

interface SequencePuzzleProps {
  puzzleId: string;
  onClose: () => void;
}

export function SequencePuzzle({ puzzleId, onClose }: SequencePuzzleProps) {
  const { puzzle, data, isSolved, attemptSolve, maxAttempts, difficulty } = usePuzzle(puzzleId);
  const [selectedSequence, setSelectedSequence] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState(isSolved);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  if (!puzzle || !data) return null;
  const seqData = data as HiddenSequenceData;
  const hasLimit = maxAttempts > 0;
  const attemptsLeft = hasLimit ? maxAttempts - attempts : Infinity;

  // Items available to pick (not yet placed)
  const available = seqData.scrambledDisplay.filter((item) => {
    const placedCount = selectedSequence.filter((s) => s === item).length;
    const totalCount = seqData.scrambledDisplay.filter((s) => s === item).length;
    return placedCount < totalCount;
  });

  function handleSelectItem(item: string) {
    if (solved || locked) return;
    setSelectedSequence([...selectedSequence, item]);
    setFeedback(null);
  }

  function handleRemoveItem(index: number) {
    if (solved || locked) return;
    setSelectedSequence(selectedSequence.filter((_, i) => i !== index));
    setFeedback(null);
  }

  function handleClear() {
    setSelectedSequence([]);
    setFeedback(null);
  }

  function handleSubmit() {
    if (solved || locked) return;

    const result = attemptSolve(selectedSequence);
    if (result.correct) {
      setSolved(true);
      setFeedback(puzzle!.rewardClue ?? 'Correct!');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (hasLimit && newAttempts >= maxAttempts) {
        setLocked(true);
        setFeedback('The pieces scatter! Wait for them to settle...');
        setTimeout(() => {
          setLocked(false);
          setAttempts(Math.max(0, maxAttempts - 2));
          setFeedback('The pieces settle. Try again carefully.');
          setSelectedSequence([]);
        }, difficulty === 'hard' ? 8000 : 5000);
      } else if (hasLimit && maxAttempts - newAttempts <= 2) {
        setFeedback(`Wrong order! Only ${maxAttempts - newAttempts} attempt${maxAttempts - newAttempts === 1 ? '' : 's'} left!`);
        setSelectedSequence([]);
      } else {
        setFeedback(result.feedback ?? 'Not quite right. Try again.');
        setSelectedSequence([]);
      }
    }
  }

  const canSubmit = selectedSequence.length === seqData.scrambledDisplay.length;

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-gray-300 text-center">{puzzle.description}</p>

      {hasLimit && !solved && (
        <div className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full ${
          attemptsLeft <= 2 ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-400'
        }`}>
          {attemptsLeft <= 2 && <AlertTriangle size={14} />}
          <span>{attemptsLeft} attempt{attemptsLeft === 1 ? '' : 's'} remaining</span>
        </div>
      )}

      {/* Your order display */}
      <div className="w-full">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 text-center">Your Order</p>
        <div className="flex gap-2 min-h-[3rem] items-center justify-center flex-wrap">
          {selectedSequence.length === 0 ? (
            <span className="text-gray-600 text-sm italic">Click items below to arrange them</span>
          ) : (
            selectedSequence.map((item, i) => (
              <button
                key={`${item}-${i}`}
                onClick={() => handleRemoveItem(i)}
                disabled={locked || solved}
                className="flex items-center gap-1 px-3 py-2 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-lg text-sm font-bold hover:bg-amber-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{item}</span>
                {!solved && !locked && <X size={12} />}
              </button>
            ))
          )}
        </div>
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
          {/* Available items pool */}
          <div className="w-full">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 text-center">Available</p>
            <div className="flex gap-3 flex-wrap justify-center">
              {available.map((item, i) => (
                <button
                  key={`${item}-${i}`}
                  onClick={() => handleSelectItem(item)}
                  disabled={locked}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg font-bold text-sm hover:bg-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClear}
              disabled={locked || selectedSequence.length === 0}
              className="text-sm text-gray-400 hover:text-white underline disabled:opacity-40"
            >
              Clear
            </button>
            <button
              onClick={handleSubmit}
              disabled={locked || !canSubmit}
              className="px-6 py-2 bg-amber-500 text-gray-900 font-bold rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>

          {feedback && (
            <p className={`text-sm text-center animate-pulse ${locked ? 'text-orange-400' : 'text-red-400'}`}>
              {feedback}
            </p>
          )}
          {locked && (
            <div className="text-orange-400 text-xs">Pieces are shuffling — please wait...</div>
          )}
        </>
      )}
    </div>
  );
}
