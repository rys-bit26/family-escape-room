import { create } from 'zustand';

interface UiStore {
  journalOpen: boolean;
  hintModalOpen: boolean;
  examineObjectId: string | null;
  activePuzzleId: string | null;
  activeMessage: string | null;
  selectedInventoryItem: string | null;

  toggleJournal: () => void;
  toggleHintModal: () => void;
  closeHintModal: () => void;
  openExamine: (objectId: string, description: string) => void;
  closeExamine: () => void;
  openPuzzle: (puzzleId: string) => void;
  closePuzzle: () => void;
  showMessage: (message: string) => void;
  closeMessage: () => void;
  selectInventoryItem: (itemId: string | null) => void;
}

// Store the examine description separately so we can display it
let _examineDescription = '';
export function getExamineDescription() { return _examineDescription; }

export const useUiStore = create<UiStore>((set) => ({
  journalOpen: false,
  hintModalOpen: false,
  examineObjectId: null,
  activePuzzleId: null,
  activeMessage: null,
  selectedInventoryItem: null,

  toggleJournal: () => set((s) => ({ journalOpen: !s.journalOpen })),
  toggleHintModal: () => set((s) => ({ hintModalOpen: !s.hintModalOpen })),
  closeHintModal: () => set({ hintModalOpen: false }),
  openExamine: (objectId, description) => {
    _examineDescription = description;
    set({ examineObjectId: objectId });
  },
  closeExamine: () => set({ examineObjectId: null }),
  openPuzzle: (puzzleId) => set({ activePuzzleId: puzzleId }),
  closePuzzle: () => set({ activePuzzleId: null }),
  showMessage: (message) => set({ activeMessage: message }),
  closeMessage: () => set({ activeMessage: null }),
  selectInventoryItem: (itemId) => set({ selectedInventoryItem: itemId }),
}));
