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
];

export function getItemById(id: string): InventoryItemDefinition | undefined {
  return allItems.find(item => item.id === id);
}
