import { useNavigate } from 'react-router';
import { useGameStore } from '../../store/gameStore.ts';
import { getRoomById } from '../../data/rooms/index.ts';
import { ROOM_NARRATIVES } from '../../data/narrative.ts';
import { BookOpen, Gamepad2, Rocket, Music, ArrowRight } from 'lucide-react';

const ROOM_ICONS: Record<string, typeof BookOpen> = {
  library: BookOpen,
  arcade: Gamepad2,
  'space-station': Rocket,
  'concert-hall': Music,
};

export function RoomCompleteScreen() {
  const completedRoomId = useGameStore((s) => s.completedRoomId);
  const setRoomCompleteVisible = useGameStore((s) => s.setRoomCompleteVisible);
  const unlockRoom = useGameStore((s) => s.unlockRoom);
  const moveToRoom = useGameStore((s) => s.moveToRoom);
  const completeGame = useGameStore((s) => s.completeGame);
  const navigate = useNavigate();

  if (!completedRoomId) return null;

  const room = getRoomById(completedRoomId);
  const narrative = ROOM_NARRATIVES[completedRoomId];
  const nextRoomId = room?.nextRoomId;
  const nextRoom = nextRoomId ? getRoomById(nextRoomId) : null;
  const Icon = ROOM_ICONS[completedRoomId] ?? BookOpen;

  function handleContinue() {
    setRoomCompleteVisible(null);
    if (nextRoomId) {
      unlockRoom(nextRoomId);
      moveToRoom(nextRoomId);
    } else {
      completeGame();
      navigate('/victory');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        <Icon size={48} className="text-amber-400" />
        <h2 className="text-3xl font-bold text-amber-400">
          {room?.name} Complete!
        </h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          {narrative?.outroText ?? 'You solved all the puzzles!'}
        </p>
        {nextRoom && (
          <p className="text-gray-400 text-sm">
            Next up: {nextRoom.name}
          </p>
        )}
        <button
          onClick={handleContinue}
          className="flex items-center gap-2 px-8 py-3 bg-amber-500 text-gray-900 font-bold text-lg rounded-xl hover:bg-amber-400 transition-colors"
        >
          {nextRoom ? 'Continue' : 'See Results'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
