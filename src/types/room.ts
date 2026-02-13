export interface RoomDefinition {
  id: string;
  name: string;
  theme: string;
  description: string;
  backgroundImage: string;
  hotSpots: HotSpot[];
  puzzleIds: string[];
  requiredPuzzleIds: string[];
  exitCondition: ExitCondition;
  nextRoomId: string | null;
}

export interface HotSpot {
  id: string;
  roomId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  type: HotSpotType;
  action: HotSpotAction;
  visibleWhen?: VisibilityCondition;
  glowOnEasy?: boolean;
}

export type HotSpotType = 'examine' | 'pickup' | 'puzzle' | 'use_item' | 'decoration';

export type HotSpotAction =
  | { kind: 'examine'; description: string; imageUrl?: string }
  | { kind: 'pickup'; itemId: string }
  | { kind: 'open_puzzle'; puzzleId: string }
  | { kind: 'use_item'; requiredItemId: string; resultAction: HotSpotAction }
  | { kind: 'show_message'; message: string }
  | { kind: 'add_journal_entry'; entryText: string };

export interface VisibilityCondition {
  type: 'puzzle_solved' | 'item_collected' | 'always' | 'object_examined';
  targetId: string;
}

export interface ExitCondition {
  type: 'all_required_puzzles' | 'code_entry' | 'item_used';
  code?: string;
  itemId?: string;
}
