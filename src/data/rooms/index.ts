import type { RoomDefinition } from '../../types/room.ts';
import { libraryRoom } from './library.ts';
import { arcadeRoom } from './arcade.ts';
import { spaceStationRoom } from './space-station.ts';
import { concertHallRoom } from './concert-hall.ts';

const ALL_ROOMS: RoomDefinition[] = [
  libraryRoom,
  arcadeRoom,
  spaceStationRoom,
  concertHallRoom,
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

export const CAMPAIGN_ROOM_ORDER = ['library', 'arcade', 'concert-hall', 'space-station'];
