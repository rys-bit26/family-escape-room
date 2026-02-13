import type { DifficultyLevel } from '../../types/game.ts';

interface DifficultySelectorProps {
  selected: DifficultyLevel;
  onChange: (level: DifficultyLevel) => void;
}

const difficulties: { level: DifficultyLevel; label: string; description: string }[] = [
  { level: 'easy', label: 'Easy', description: 'Helpful hints, glowing hotspots, simpler puzzles' },
  { level: 'medium', label: 'Medium', description: 'Some hints available, standard puzzles' },
  { level: 'hard', label: 'Hard', description: 'Fewer hints, extra distractors, no glow' },
];

export function DifficultySelector({ selected, onChange }: DifficultySelectorProps) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      {difficulties.map(({ level, label, description }) => (
        <button
          key={level}
          onClick={() => onChange(level)}
          className={`text-left px-5 py-3 rounded-lg border-2 transition-all ${
            selected === level
              ? 'border-amber-400 bg-amber-400/10 text-amber-400'
              : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
          }`}
        >
          <div className="font-bold text-lg">{label}</div>
          <div className="text-sm opacity-75">{description}</div>
        </button>
      ))}
    </div>
  );
}
