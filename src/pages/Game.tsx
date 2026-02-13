import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useGameStore } from '../store/gameStore.ts';
import { useUiStore } from '../store/uiStore.ts';
import { getRoomById } from '../data/rooms/index.ts';
import { isRoomComplete } from '../engine/roomEngine.ts';
import { RoomView } from '../components/room/RoomView.tsx';
import { PuzzleModal } from '../components/puzzle/PuzzleModal.tsx';
import { InventoryBar } from '../components/inventory/InventoryBar.tsx';
import { MessageOverlay } from '../components/screens/MessageOverlay.tsx';
import { HintModal } from '../components/screens/HintModal.tsx';

export default function Game() {
  const status = useGameStore((s) => s.status);
  const currentRoomId = useGameStore((s) => s.currentRoomId);
  const solvedPuzzleIds = useGameStore((s) => s.solvedPuzzleIds);
  const completeGame = useGameStore((s) => s.completeGame);
  const hintModalOpen = useUiStore((s) => s.hintModalOpen);
  const closeHintModal = useUiStore((s) => s.closeHintModal);
  const navigate = useNavigate();

  // Redirect to home if no active game
  useEffect(() => {
    if (status !== 'in_progress') {
      navigate('/');
    }
  }, [status, navigate]);

  // Check room completion
  useEffect(() => {
    const room = getRoomById(currentRoomId);
    if (room && isRoomComplete(room, solvedPuzzleIds)) {
      if (room.nextRoomId) {
        // TODO: transition to next room
      } else {
        // Final room completed!
        completeGame();
        navigate('/victory');
      }
    }
  }, [currentRoomId, solvedPuzzleIds, completeGame, navigate]);

  if (status !== 'in_progress') return null;

  return (
    <div className="h-full relative">
      <RoomView />
      <PuzzleModal />
      <InventoryBar />
      <MessageOverlay />
      {hintModalOpen && <HintModal onClose={closeHintModal} />}
    </div>
  );
}
