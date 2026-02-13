import type { RoomDefinition } from '../../types/room.ts';
import { libraryRoom } from './library.ts';

const ALL_ROOMS: RoomDefinition[] = [
  libraryRoom,
];

export function getRoomById(id: string): RoomDefinition | undefined {
  return ALL_ROOMS.find(r => r.id === id);
}

export function getFirstRoomId(): string {
  return ALL_ROOMS[0].id;
}

export function getAllRooms(): RoomDefinition[] {
  return ALL_ROOMS;
}
