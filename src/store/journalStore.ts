import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface JournalEntry {
  id: string;
  text: string;
  roomId: string;
  discoveredAt: number;
  puzzleId?: string;
}

interface JournalStore {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'discoveredAt'>) => void;
  hasEntry: (text: string) => boolean;
  reset: () => void;
}

export const useJournalStore = create<JournalStore>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        if (get().entries.some(e => e.text === entry.text)) return;
        set((s) => ({
          entries: [...s.entries, {
            ...entry,
            id: crypto.randomUUID(),
            discoveredAt: Date.now(),
          }],
        }));
      },

      hasEntry: (text) => get().entries.some(e => e.text === text),

      reset: () => set({ entries: [] }),
    }),
    { name: 'family-escape-room-journal', version: 1 }
  )
);
