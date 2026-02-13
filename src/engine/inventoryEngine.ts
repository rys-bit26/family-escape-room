import type { InventoryItemDefinition } from '../types/inventory.ts';

export function canCombineItems(
  item1: InventoryItemDefinition,
  item2: InventoryItemDefinition
): string | null {
  if (item1.canCombineWith?.includes(item2.id)) {
    return item1.combinationResult ?? null;
  }
  if (item2.canCombineWith?.includes(item1.id)) {
    return item2.combinationResult ?? null;
  }
  return null;
}
