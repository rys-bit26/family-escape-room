import { KeyRound, Box } from 'lucide-react';
import type { InventoryItemDefinition } from '../../types/inventory.ts';

interface InventoryItemProps {
  item: InventoryItemDefinition;
}

export function InventoryItem({ item }: InventoryItemProps) {
  const Icon = item.isKey ? KeyRound : Box;

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 rounded-lg border border-amber-400/30 text-amber-300 text-sm whitespace-nowrap"
      title={item.description}
    >
      <Icon size={16} />
      <span>{item.name}</span>
    </div>
  );
}
