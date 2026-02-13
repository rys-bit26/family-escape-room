import type { RoomDefinition } from '../types/room.ts';

export function isRoomComplete(
  room: RoomDefinition,
  solvedPuzzleIds: string[]
): boolean {
  return room.requiredPuzzleIds.every(id => solvedPuzzleIds.includes(id));
}

export function getVisibleHotSpots(
  room: RoomDefinition,
  solvedPuzzleIds: string[],
  collectedItemIds: string[],
  discoveredObjectIds: string[]
) {
  return room.hotSpots.filter(hs => {
    if (!hs.visibleWhen || hs.visibleWhen.type === 'always') return true;
    switch (hs.visibleWhen.type) {
      case 'puzzle_solved':
        return solvedPuzzleIds.includes(hs.visibleWhen.targetId);
      case 'item_collected':
        return collectedItemIds.includes(hs.visibleWhen.targetId);
      case 'object_examined':
        return discoveredObjectIds.includes(hs.visibleWhen.targetId);
      default:
        return true;
    }
  });
}
