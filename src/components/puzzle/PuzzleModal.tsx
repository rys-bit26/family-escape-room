import { Modal } from '../common/Modal.tsx';
import { useUiStore } from '../../store/uiStore.ts';
import { getPuzzleById } from '../../data/puzzles/index.ts';
import { getPuzzleComponent } from './PuzzleRegistry.tsx';

export function PuzzleModal() {
  const activePuzzleId = useUiStore((s) => s.activePuzzleId);
  const closePuzzle = useUiStore((s) => s.closePuzzle);

  if (!activePuzzleId) return null;

  const puzzle = getPuzzleById(activePuzzleId);
  if (!puzzle) return null;

  const PuzzleComponent = getPuzzleComponent(puzzle.type);

  return (
    <Modal onClose={closePuzzle} title={puzzle.name}>
      <PuzzleComponent puzzleId={activePuzzleId} onClose={closePuzzle} />
    </Modal>
  );
}
