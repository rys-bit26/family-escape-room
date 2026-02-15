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
import { RoomCompleteScreen } from '../components/screens/RoomCompleteScreen.tsx';
import { StoryIntroOverlay } from '../components/screens/StoryIntroOverlay.tsx';

export default function Game() {
  const status = useGameStore((s) => s.status);
  const currentRoomId = useGameStore((s) => s.currentRoomId);
  const solvedPuzzleIds = useGameStore((s) => s.solvedPuzzleIds);
  const completeGame = useGameStore((s) => s.completeGame);
  const mode = useGameStore((s) => s.mode);
  const showRoomComplete = useGameStore((s) => s.showRoomComplete);
  const setRoomCompleteVisible = useGameStore((s) => s.setRoomCompleteVisible);
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
    if (showRoomComplete) return;

    const room = getRoomById(currentRoomId);
    if (room && isRoomComplete(room, solvedPuzzleIds)) {
      if (mode === 'campaign') {
        // Show room-complete screen for all campaign rooms (including final)
        setRoomCompleteVisible(currentRoomId);
      } else {
        // Freeplay: go straight to victory
        completeGame();
        navigate('/victory');
      }
    }
  }, [currentRoomId, solvedPuzzleIds, completeGame, navigate, mode, showRoomComplete, setRoomCompleteVisible]);

  if (status !== 'in_progress') return null;

  return (
    <div className="h-full relative">
      <RoomView />
      <PuzzleModal />
      <InventoryBar />
      <MessageOverlay />
      {hintModalOpen && <HintModal onClose={closeHintModal} />}
      {showRoomComplete && <RoomCompleteScreen />}
      <StoryIntroOverlay />
    </div>
  );
}
