import type { RoomDefinition } from '../../types/room.ts';

export const spaceStationRoom: RoomDefinition = {
  id: 'space-station',
  name: 'International Space Station',
  theme: 'space-station',
  description: 'You are aboard a space station orbiting Earth. An alarm blares — get to the escape pod before it is too late!',
  backgroundImage: '/assets/rooms/space-station/background.svg',
  nextRoomId: null,

  hotSpots: [
    {
      id: 'space-console',
      roomId: 'space-station',
      x: 5, y: 10, width: 25, height: 35,
      label: 'Mission Console',
      type: 'examine',
      action: {
        kind: 'examine',
        description: 'The mission console displays: "Authorization required. Reference: 2001 Space Odyssey Protocol."',
      },
      glowOnEasy: true,
    },
    {
      id: 'space-airlock',
      roomId: 'space-station',
      x: 5, y: 50, width: 22, height: 40,
      label: 'Airlock Panel',
      type: 'puzzle',
      action: { kind: 'open_puzzle', puzzleId: 'space-airlock-code' },
      glowOnEasy: true,
    },
    {
      id: 'space-star-chart',
      roomId: 'space-station',
      x: 32, y: 5, width: 20, height: 25,
      label: 'Star Chart',
      type: 'examine',
      action: {
        kind: 'add_journal_entry',
        entryText: 'Star chart shows waypoints: Earth(Blue) -> Mars(Red) -> Nebula(Green) -> Comet(Cyan) -> Sun(Yellow).',
      },
      glowOnEasy: true,
    },
    {
      id: 'space-navigation',
      roomId: 'space-station',
      x: 30, y: 35, width: 25, height: 35,
      label: 'Navigation Console',
      type: 'puzzle',
      action: { kind: 'open_puzzle', puzzleId: 'space-nav-pattern' },
    },
    {
      id: 'space-toolkit-use',
      roomId: 'space-station',
      x: 60, y: 30, width: 18, height: 40,
      label: 'Crew Terminal',
      type: 'use_item',
      action: {
        kind: 'use_item',
        requiredItemId: 'space-toolkit',
        resultAction: { kind: 'open_puzzle', puzzleId: 'space-logic' },
      },
      glowOnEasy: true,
    },
    {
      id: 'space-escape-pod',
      roomId: 'space-station',
      x: 82, y: 20, width: 15, height: 60,
      label: 'Escape Pod',
      type: 'puzzle',
      action: { kind: 'open_puzzle', puzzleId: 'space-exit' },
      visibleWhen: { type: 'puzzle_solved', targetId: 'space-logic' },
    },
    // Red herrings
    {
      id: 'space-window',
      roomId: 'space-station',
      x: 55, y: 5, width: 20, height: 20,
      label: 'Observation Window',
      type: 'decoration',
      action: { kind: 'show_message', message: 'You gaze out at Earth below. Beautiful, but you need to focus on escaping!' },
    },
    {
      id: 'space-plant',
      roomId: 'space-station',
      x: 80, y: 80, width: 10, height: 15,
      label: 'Space Plant',
      type: 'decoration',
      action: { kind: 'show_message', message: 'A small plant grows in the hydroponics module. It waves gently in the air current.' },
    },
    {
      id: 'space-sleeping-pod',
      roomId: 'space-station',
      x: 60, y: 75, width: 15, height: 18,
      label: 'Sleep Pod',
      type: 'decoration',
      action: { kind: 'show_message', message: 'An empty sleep pod. This is not the time for a nap!' },
    },
  ],

  puzzleIds: ['space-airlock-code', 'space-nav-pattern', 'space-logic', 'space-exit'],
  requiredPuzzleIds: ['space-airlock-code', 'space-nav-pattern', 'space-logic', 'space-exit'],

  exitCondition: {
    type: 'all_required_puzzles',
  },
};
