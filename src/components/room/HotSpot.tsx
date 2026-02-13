import type { HotSpot as HotSpotType } from '../../types/room.ts';
import { useGameStore } from '../../store/gameStore.ts';

interface HotSpotProps {
  hotSpot: HotSpotType;
  onClick: () => void;
  isInteracted: boolean;
}

export function HotSpot({ hotSpot, onClick, isInteracted }: HotSpotProps) {
  const difficulty = useGameStore((s) => s.difficulty);
  const isHard = difficulty === 'hard';
  const showGlow = hotSpot.glowOnEasy && difficulty === 'easy' && !isInteracted;

  return (
    <button
      onClick={onClick}
      className={`absolute border-2 rounded-lg transition-all cursor-pointer group ${
        isInteracted
          ? 'border-green-500/30 bg-green-500/5'
          : showGlow
            ? 'border-amber-400/60 bg-amber-400/10 animate-pulse'
            : 'border-transparent hover:border-amber-400/40 hover:bg-amber-400/5'
      }`}
      style={{
        left: `${hotSpot.x}%`,
        top: `${hotSpot.y}%`,
        width: `${hotSpot.width}%`,
        height: `${hotSpot.height}%`,
      }}
      title={isHard ? undefined : hotSpot.label}
    >
      {/* Hide hover labels on hard mode — players must explore blindly */}
      {!isHard && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-gray-900/90 text-amber-400 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {hotSpot.label}
        </span>
      )}
    </button>
  );
}
