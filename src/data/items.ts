import type { InventoryItemDefinition } from '../types/inventory.ts';

export const allItems: InventoryItemDefinition[] = [
  {
    id: 'brass-key',
    name: 'Brass Key',
    description: 'An old brass key found in the desk drawer.',
    icon: 'key-round',
    isKey: true,
  },
];

export function getItemById(id: string): InventoryItemDefinition | undefined {
  return allItems.find(item => item.id === id);
}
