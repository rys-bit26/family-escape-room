import type { RoomDefinition } from '../../types/room.ts';

export const concertHallRoom: RoomDefinition = {
  id: 'concert-hall',
  name: 'Old Concert Hall',
  theme: 'concert-hall',
  description: 'A grand but abandoned concert hall. The curtains sway. Can you decipher the musical mysteries and take your final bow?',
  backgroundImage: '/assets/rooms/concert-hall/background.svg',
  nextRoomId: null,

  hotSpots: [
    {
      id: 'concert-sheet-music',
      roomId: 'concert-hall',
      x: 15, y: 25, width: 12, height: 20,
      label: 'Sheet Music',
      type: 'examine',
      action: {
        kind: 'add_journal_entry',
        entryText: 'Sheet music shows four descending notes: Fa(4), Mi(3), Re(2), Do(1).',
      },
      glowOnEasy: true,
    },
    {
      id: 'concert-piano',
      roomId: 'concert-hall',
      x: 5, y: 45, width: 30, height: 35,
      label: 'Grand Piano',
      type: 'puzzle',
      action: { kind: 'open_puzzle', puzzleId: 'concert-piano-code' },
      glowOnEasy: true,
    },
    {
      id: 'concert-vip-seats',
      roomId: 'concert-hall',
      x: 38, y: 60, width: 25, height: 20,
      label: 'VIP Seats',
      type: 'examine',
      action: {
        kind: 'add_journal_entry',
        entryText: 'The VIP row seats have colored cushions, left to right: Purple, Blue, Red, Yellow, Green.',
      },
      glowOnEasy: true,
    },
    {
      id: 'concert-stage-lights',
      roomId: 'concert-hall',
      x: 35, y: 10, width: 30, height: 20,
      label: 'Stage Spotlights',
      type: 'puzzle',
      action: { kind: 'open_puzzle', puzzleId: 'concert-spotlight-pattern' },
    },
    {
      id: 'concert-curtain',
      roomId: 'concert-hall',
      x: 68, y: 10, width: 15, height: 60,
      label: 'Velvet Curtain',
      type: 'use_item',
      action: {
        kind: 'use_item',
        requiredItemId: 'conductor-baton',
        resultAction: { kind: 'open_puzzle', puzzleId: 'concert-riddle' },
      },
      glowOnEasy: true,
    },
    {
      id: 'concert-stage-door',
      roomId: 'concert-hall',
      x: 85, y: 15, width: 12, height: 65,
      label: 'Stage Door',
      type: 'puzzle',
      action: { kind: 'open_puzzle', puzzleId: 'concert-exit' },
      visibleWhen: { type: 'puzzle_solved', targetId: 'concert-riddle' },
    },
    // Red herrings
    {
      id: 'concert-chandelier',
      roomId: 'concert-hall',
      x: 45, y: 0, width: 15, height: 10,
      label: 'Chandelier',
      type: 'decoration',
      action: { kind: 'show_message', message: 'A magnificent crystal chandelier hangs above. It tinkles softly, but holds no secrets.' },
    },
    {
      id: 'concert-violin-case',
      roomId: 'concert-hall',
      x: 38, y: 40, width: 10, height: 15,
      label: 'Violin Case',
      type: 'decoration',
      action: { kind: 'show_message', message: 'An empty violin case sits open on a chair. The instrument is long gone.' },
    },
    {
      id: 'concert-program',
      roomId: 'concert-hall',
      x: 65, y: 75, width: 12, height: 12,
      label: 'Old Program',
      type: 'decoration',
      action: { kind: 'show_message', message: 'A dusty concert program from 1923. The headliner was someone named "R. Herring." Suspicious name...' },
    },
    {
      id: 'concert-music-stand',
      roomId: 'concert-hall',
      x: 25, y: 35, width: 8, height: 15,
      label: 'Music Stand',
      type: 'decoration',
      action: { kind: 'show_message', message: 'An empty music stand wobbles when you touch it. Nothing useful here.' },
    },
  ],

  puzzleIds: ['concert-piano-code', 'concert-spotlight-pattern', 'concert-riddle', 'concert-exit'],
  requiredPuzzleIds: ['concert-piano-code', 'concert-spotlight-pattern', 'concert-riddle', 'concert-exit'],

  exitCondition: {
    type: 'all_required_puzzles',
  },
};
