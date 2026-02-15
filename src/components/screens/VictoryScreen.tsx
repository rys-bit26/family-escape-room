import { useGameStore } from '../../store/gameStore.ts';
import { useNavigate } from 'react-router';
import { CAMPAIGN_VICTORY } from '../../data/narrative.ts';

export function VictoryScreen() {
  const elapsedSeconds = useGameStore((s) => s.elapsedSeconds);
  const hintsUsed = useGameStore((s) => s.hintsUsed);
  const mode = useGameStore((s) => s.mode);
  const resetGame = useGameStore((s) => s.resetGame);
  const navigate = useNavigate();

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeStr = `${minutes}m ${seconds}s`;

  function handlePlayAgain() {
    resetGame();
    navigate('/');
  }

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        <div className="text-7xl">🎉</div>
        <h1 className="text-4xl font-bold text-amber-400">You Escaped!</h1>
        <p className="text-gray-300 text-lg">
          {mode === 'campaign'
            ? CAMPAIGN_VICTORY
            : 'Congratulations! Your family solved all the puzzles and made it out!'}
        </p>

        <div className="bg-gray-800 rounded-xl p-6 w-full border border-gray-700">
          {mode === 'campaign' && (
            <div className="flex justify-between text-gray-300 mb-3">
              <span>Rooms Completed</span>
              <span className="font-mono font-bold text-amber-400">4</span>
            </div>
          )}
          <div className="flex justify-between text-gray-300 mb-3">
            <span>Time</span>
            <span className="font-mono font-bold text-amber-400">{timeStr}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Hints Used</span>
            <span className="font-mono font-bold text-amber-400">{hintsUsed}</span>
          </div>
        </div>

        <button
          onClick={handlePlayAgain}
          className="px-8 py-3 bg-amber-500 text-gray-900 font-bold text-lg rounded-xl hover:bg-amber-400 transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
