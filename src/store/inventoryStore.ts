import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface InventoryStore {
  collectedItemIds: string[];
  usedItemIds: string[];
  pickupItem: (itemId: string) => void;
  useItem: (itemId: string) => void;
  combineItems: (itemId1: string, itemId2: string, resultId: string) => void;
  hasItem: (itemId: string) => boolean;
  reset: () => void;
}

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      collectedItemIds: [],
      usedItemIds: [],

      pickupItem: (itemId) => set((s) => ({
        collectedItemIds: [...new Set([...s.collectedItemIds, itemId])],
      })),

      useItem: (itemId) => set((s) => ({
        usedItemIds: [...new Set([...s.usedItemIds, itemId])],
      })),

      combineItems: (itemId1, itemId2, resultId) => set((s) => ({
        usedItemIds: [...new Set([...s.usedItemIds, itemId1, itemId2])],
        collectedItemIds: [...new Set([
          ...s.collectedItemIds.filter(id => id !== itemId1 && id !== itemId2),
          resultId,
        ])],
      })),

      hasItem: (itemId) => {
        const s = get();
        return s.collectedItemIds.includes(itemId) && !s.usedItemIds.includes(itemId);
      },

      reset: () => set({ collectedItemIds: [], usedItemIds: [] }),
    }),
    { name: 'family-escape-room-inventory', version: 1 }
  )
);
