import { useGameStore } from '../../store/gameStore.ts';
import { CAMPAIGN_INTRO, ROOM_NARRATIVES } from '../../data/narrative.ts';
import { Play } from 'lucide-react';

export function StoryIntroOverlay() {
  const storyIntroSeen = useGameStore((s) => s.storyIntroSeen);
  const setStoryIntroSeen = useGameStore((s) => s.setStoryIntroSeen);
  const mode = useGameStore((s) => s.mode);
  const currentRoomId = useGameStore((s) => s.currentRoomId);

  if (mode !== 'campaign' || storyIntroSeen) return null;

  const roomNarrative = ROOM_NARRATIVES[currentRoomId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
      <div className="flex flex-col items-center gap-6 max-w-lg text-center">
        <h2 className="text-3xl font-bold text-amber-400">The Adventure Begins</h2>
        <p className="text-gray-300 text-lg leading-relaxed">{CAMPAIGN_INTRO}</p>
        {roomNarrative && (
          <p className="text-amber-300/80 italic">{roomNarrative.introText}</p>
        )}
        <button
          onClick={setStoryIntroSeen}
          className="flex items-center gap-2 px-8 py-3 bg-amber-500 text-gray-900 font-bold text-lg rounded-xl hover:bg-amber-400 transition-colors"
        >
          <Play size={20} />
          Begin
        </button>
      </div>
    </div>
  );
}
