import { useState } from 'react';
import { usePuzzle } from '../../hooks/usePuzzle.ts';
import { useInventoryStore } from '../../store/inventoryStore.ts';
import { getItemById } from '../../data/items.ts';
import type { ItemCombinationData } from '../../types/puzzle.ts';
import { Check, Lock } from 'lucide-react';

interface ItemCombinationPuzzleProps {
  puzzleId: string;
  onClose: () => void;
}

export function ItemCombinationPuzzle({ puzzleId, onClose }: ItemCombinationPuzzleProps) {
  const { puzzle, data, isSolved, attemptSolve } = usePuzzle(puzzleId);
  const hasItem = useInventoryStore((s) => s.hasItem);
  const combineItems = useInventoryStore((s) => s.combineItems);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState(isSolved);

  if (!puzzle || !data) return null;
  const combData = data as ItemCombinationData;

  const itemStatuses = combData.requiredItems.map((itemId) => ({
    id: itemId,
    item: getItemById(itemId),
    hasIt: hasItem(itemId),
  }));

  const allItemsCollected = itemStatuses.every((s) => s.hasIt);

  function handleCombine() {
    if (solved) return;

    const result = attemptSolve(combData.requiredItems);
    if (result.correct) {
      if (combData.requiredItems.length === 2) {
        combineItems(combData.requiredItems[0], combData.requiredItems[1], combData.resultItemId);
      }
      setSolved(true);
      setFeedback(puzzle!.rewardClue ?? 'Items combined!');
    } else {
      setFeedback(result.feedback ?? 'Something went wrong.');
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-gray-300 text-center">{puzzle.description}</p>

      {/* Required items list */}
      <div className="w-full space-y-3">
        <p className="text-gray-500 text-xs uppercase tracking-wider text-center">Required Items</p>
        {itemStatuses.map(({ id, item, hasIt }) => (
          <div
            key={id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
              hasIt
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-gray-800 border-gray-700'
            }`}
          >
            {hasIt ? (
              <Check size={18} className="text-green-400 shrink-0" />
            ) : (
              <Lock size={18} className="text-gray-500 shrink-0" />
            )}
            <div>
              <div className={`font-bold text-sm ${hasIt ? 'text-green-400' : 'text-gray-500'}`}>
                {item?.name ?? id}
              </div>
              <div className="text-gray-500 text-xs">
                {hasIt ? item?.description : 'Not yet found...'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {solved ? (
        <div className="text-center">
          <div className="text-green-400 text-lg font-bold mb-3">Combined!</div>
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
          {allItemsCollected ? (
            <button
              onClick={handleCombine}
              className="px-6 py-3 bg-amber-500 text-gray-900 font-bold rounded-lg hover:bg-amber-400 transition-colors"
            >
              Combine Items
            </button>
          ) : (
            <p className="text-gray-500 text-sm italic text-center">
              Find all the required items to combine them.
            </p>
          )}

          {feedback && (
            <p className="text-sm text-center text-red-400 animate-pulse">{feedback}</p>
          )}
        </>
      )}
    </div>
  );
}
