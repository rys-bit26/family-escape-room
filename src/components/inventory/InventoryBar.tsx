import { Package } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore.ts';
import { getItemById } from '../../data/items.ts';
import { InventoryItem } from './InventoryItem.tsx';

export function InventoryBar() {
  const collectedItemIds = useInventoryStore((s) => s.collectedItemIds);
  const usedItemIds = useInventoryStore((s) => s.usedItemIds);

  const activeItems = collectedItemIds.filter(id => !usedItemIds.includes(id));

  if (activeItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-800/95 border-t border-gray-700 px-4 py-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-gray-400 text-sm shrink-0">
          <Package size={16} />
          <span>Inventory</span>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {activeItems.map(itemId => {
            const item = getItemById(itemId);
            if (!item) return null;
            return <InventoryItem key={itemId} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
}
