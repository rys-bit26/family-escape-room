import type { InventoryItemDefinition } from '../types/inventory.ts';

export const allItems: InventoryItemDefinition[] = [
  // Library
  {
    id: 'brass-key',
    name: 'Brass Key',
    description: 'An old brass key found in the desk drawer.',
    icon: 'key-round',
    isKey: true,
  },
  // Arcade
  {
    id: 'arcade-token',
    name: 'Arcade Token',
    description: 'A shiny token that says "PLAYER 2" on one side.',
    icon: 'coins',
    isKey: true,
  },
  // Space Station
  {
    id: 'space-toolkit',
    name: 'Space Toolkit',
    description: 'A floating toolkit with magnetic tools inside.',
    icon: 'wrench',
    isKey: true,
  },
  // Concert Hall
  {
    id: 'conductor-baton',
    name: 'Conductor Baton',
    description: 'An elegant conductor baton found inside the grand piano.',
    icon: 'wand-2',
    isKey: true,
  },
  // Arcade - item_combination puzzle
  {
    id: 'broken-joystick',
    name: 'Broken Joystick',
    description: 'A joystick handle snapped off an old arcade machine.',
    icon: 'joystick',
    canCombineWith: ['circuit-board'],
    combinationResult: 'repaired-joystick',
  },
  {
    id: 'circuit-board',
    name: 'Circuit Board',
    description: 'A small green circuit board with blinking LEDs.',
    icon: 'cpu',
    canCombineWith: ['broken-joystick'],
    combinationResult: 'repaired-joystick',
  },
  {
    id: 'repaired-joystick',
    name: 'Repaired Joystick',
    description: 'A fully working joystick, ready to be plugged back in.',
    icon: 'gamepad-2',
    isKey: true,
  },
];

export function getItemById(id: string): InventoryItemDefinition | undefined {
  return allItems.find(item => item.id === id);
}
