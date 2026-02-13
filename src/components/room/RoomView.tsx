import { useCallback } from 'react';
import { useGameStore } from '../../store/gameStore.ts';
import { useInventoryStore } from '../../store/inventoryStore.ts';
import { useJournalStore } from '../../store/journalStore.ts';
import { useUiStore } from '../../store/uiStore.ts';
import { getRoomById } from '../../data/rooms/index.ts';
import { getVisibleHotSpots } from '../../engine/roomEngine.ts';
import { HotSpot } from './HotSpot.tsx';
import { ObjectExamine } from './ObjectExamine.tsx';
import type { HotSpotAction, HotSpot as HotSpotDef } from '../../types/room.ts';

export function RoomView() {
  const currentRoomId = useGameStore((s) => s.currentRoomId);
  const solvedPuzzleIds = useGameStore((s) => s.solvedPuzzleIds);
  const discoveredObjectIds = useGameStore((s) => s.discoveredObjectIds);
  const discoverObject = useGameStore((s) => s.discoverObject);
  const collectedItemIds = useInventoryStore((s) => s.collectedItemIds);
  const hasItem = useInventoryStore((s) => s.hasItem);
  const pickupItem = useInventoryStore((s) => s.pickupItem);
  const useItem = useInventoryStore((s) => s.useItem);
  const addJournalEntry = useJournalStore((s) => s.addEntry);
  const openExamine = useUiStore((s) => s.openExamine);
  const openPuzzle = useUiStore((s) => s.openPuzzle);
  const showMessage = useUiStore((s) => s.showMessage);

  const room = getRoomById(currentRoomId);

  const handleAction = useCallback((action: HotSpotAction, hotSpot: HotSpotDef) => {
    discoverObject(hotSpot.id);

    switch (action.kind) {
      case 'examine':
        openExamine(hotSpot.id, action.description);
        break;
      case 'pickup':
        pickupItem(action.itemId);
        showMessage(`Found: ${hotSpot.label}!`);
        break;
      case 'open_puzzle':
        openPuzzle(action.puzzleId);
        break;
      case 'use_item':
        if (hasItem(action.requiredItemId)) {
          useItem(action.requiredItemId);
          handleAction(action.resultAction, hotSpot);
        } else {
          showMessage('You need something to use here...');
        }
        break;
      case 'show_message':
        showMessage(action.message);
        break;
      case 'add_journal_entry':
        addJournalEntry({ text: action.entryText, roomId: currentRoomId });
        showMessage('Added a clue to your journal!');
        break;
    }
  }, [currentRoomId, discoverObject, openExamine, openPuzzle, showMessage, pickupItem, hasItem, useItem, addJournalEntry]);

  if (!room) return <div className="flex-1 flex items-center justify-center text-gray-400">Room not found</div>;

  const visibleHotSpots = getVisibleHotSpots(room, solvedPuzzleIds, collectedItemIds, discoveredObjectIds);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Room Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <RoomBackground theme={room.theme} />
      </div>

      {/* Hotspots */}
      {visibleHotSpots.map((hs) => (
        <HotSpot
          key={hs.id}
          hotSpot={hs}
          onClick={() => handleAction(hs.action, hs)}
          isInteracted={discoveredObjectIds.includes(hs.id)}
        />
      ))}

      {/* Examine Modal */}
      <ObjectExamine />
    </div>
  );
}

function RoomBackground({ theme }: { theme: string }) {
  if (theme === 'library') {
    return (
      <svg viewBox="0 0 1000 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        {/* Floor */}
        <rect x="0" y="420" width="1000" height="180" fill="#2d1b0e" />
        <rect x="0" y="420" width="1000" height="5" fill="#4a3020" />

        {/* Back wall */}
        <rect x="0" y="0" width="1000" height="420" fill="#3d2b1f" />

        {/* Wall texture lines */}
        <line x1="0" y1="200" x2="1000" y2="200" stroke="#4a3525" strokeWidth="1" />
        <line x1="0" y1="100" x2="1000" y2="100" stroke="#4a3525" strokeWidth="1" />

        {/* Left wall / door area */}
        <rect x="0" y="60" width="70" height="350" fill="#2a1a0e" rx="3" />
        <rect x="5" y="65" width="60" height="340" fill="#35220f" rx="2" />
        <circle cx="60" cy="240" r="4" fill="#c4a050" />

        {/* Bookshelf - left */}
        <rect x="80" y="80" width="220" height="340" fill="#5c3d2e" rx="3" />
        <rect x="85" y="85" width="210" height="70" fill="#4a2e1e" />
        <rect x="85" y="160" width="210" height="70" fill="#4a2e1e" />
        <rect x="85" y="235" width="210" height="70" fill="#4a2e1e" />
        <rect x="85" y="310" width="210" height="70" fill="#4a2e1e" />

        {/* Books on shelves - colored spines */}
        {/* Shelf 1 */}
        <rect x="90" y="90" width="12" height="60" fill="#c0392b" rx="1" />
        <rect x="105" y="95" width="10" height="55" fill="#2980b9" rx="1" />
        <rect x="118" y="88" width="14" height="62" fill="#27ae60" rx="1" />
        <rect x="135" y="92" width="11" height="58" fill="#f1c40f" rx="1" />
        <rect x="149" y="90" width="13" height="60" fill="#8e44ad" rx="1" />
        <rect x="165" y="94" width="10" height="56" fill="#c0392b" rx="1" />
        <rect x="178" y="89" width="15" height="61" fill="#2c3e50" rx="1" />
        <rect x="196" y="92" width="12" height="58" fill="#e67e22" rx="1" />
        <rect x="211" y="87" width="11" height="63" fill="#1abc9c" rx="1" />
        <rect x="225" y="91" width="14" height="59" fill="#34495e" rx="1" />

        {/* Shelf 2 */}
        <rect x="90" y="165" width="14" height="60" fill="#e74c3c" rx="1" />
        <rect x="107" y="168" width="11" height="57" fill="#3498db" rx="1" />
        <rect x="121" y="163" width="13" height="62" fill="#2ecc71" rx="1" />
        <rect x="137" y="167" width="12" height="58" fill="#f39c12" rx="1" />
        <rect x="152" y="164" width="10" height="61" fill="#9b59b6" rx="1" />
        <rect x="165" y="170" width="15" height="55" fill="#e74c3c" rx="1" />
        <rect x="183" y="166" width="11" height="59" fill="#2c3e50" rx="1" />

        {/* Shelf 3 */}
        <rect x="92" y="240" width="13" height="60" fill="#c0392b" rx="1" />
        <rect x="108" y="243" width="10" height="57" fill="#2980b9" rx="1" />
        <rect x="121" y="238" width="14" height="62" fill="#27ae60" rx="1" />
        <rect x="138" y="242" width="11" height="58" fill="#f1c40f" rx="1" />

        {/* Painting on wall */}
        <rect x="330" y="30" width="280" height="130" fill="#6d4c2a" rx="4" />
        <rect x="340" y="40" width="260" height="110" fill="#1a3a2a" />
        <circle cx="470" cy="80" r="25" fill="#f4d03f" opacity="0.8" />
        <path d="M380 130 Q420 90 460 130 Q500 90 540 130 Q560 110 580 130" fill="#2d5a3d" />
        <path d="M360 140 Q400 110 440 140 Q480 100 520 140 Q550 120 580 140 L580 150 L360 150 Z" fill="#1a4a2a" />

        {/* Desk */}
        <rect x="350" y="300" width="240" height="120" fill="#5c3d2e" rx="4" />
        <rect x="355" y="305" width="230" height="30" fill="#4a2e1e" rx="2" />
        <rect x="360" y="340" width="100" height="75" fill="#4a2e1e" rx="2" />
        <rect x="480" y="340" width="100" height="75" fill="#4a2e1e" rx="2" />
        {/* Desk drawer handle */}
        <rect x="395" y="365" width="30" height="4" fill="#c4a050" rx="2" />
        {/* Items on desk */}
        <rect x="370" y="290" width="40" height="15" fill="#8B7355" rx="2" />
        <circle cx="540" cy="295" r="8" fill="#c4a050" opacity="0.6" />

        {/* Cat statue */}
        <g transform="translate(620, 400)">
          <ellipse cx="0" cy="20" rx="20" ry="10" fill="#555" />
          <ellipse cx="0" cy="0" rx="15" ry="20" fill="#666" />
          <circle cx="0" cy="-10" r="12" fill="#666" />
          <polygon points="-10,-20 -6,-8 -14,-10" fill="#666" />
          <polygon points="10,-20 6,-8 14,-10" fill="#666" />
          <circle cx="-4" cy="-12" r="2" fill="#ffd700" />
          <circle cx="4" cy="-12" r="2" fill="#ffd700" />
        </g>

        {/* Globe */}
        <g transform="translate(760, 160)">
          <rect x="-3" y="30" width="6" height="60" fill="#5c3d2e" />
          <rect x="-15" y="85" width="30" height="8" fill="#5c3d2e" rx="2" />
          <circle cx="0" cy="15" r="40" fill="#2980b9" />
          <path d="M-30 10 Q-10 -5 0 15 Q10 35 30 20" fill="#27ae60" opacity="0.7" />
          <path d="M-20 30 Q0 20 20 30" fill="#27ae60" opacity="0.5" />
          <ellipse cx="0" cy="15" rx="40" ry="8" fill="none" stroke="#c4a050" strokeWidth="2" />
        </g>

        {/* Cabinet - right */}
        <rect x="780" y="300" width="160" height="120" fill="#5c3d2e" rx="4" />
        <rect x="785" y="305" width="70" height="110" fill="#4a2e1e" rx="2" />
        <rect x="860" y="305" width="70" height="110" fill="#4a2e1e" rx="2" />
        <circle cx="852" cy="360" r="3" fill="#c4a050" />
        <circle cx="862" cy="360" r="3" fill="#c4a050" />
        {/* Lock on cabinet */}
        <rect x="845" y="345" width="24" height="16" fill="#8B7355" rx="2" />
        <circle cx="857" cy="353" r="3" fill="#2d1b0e" />

        {/* Rug */}
        <ellipse cx="470" cy="500" rx="200" ry="60" fill="#8B0000" opacity="0.3" />
        <ellipse cx="470" cy="500" rx="180" ry="50" fill="#8B0000" opacity="0.2" />

        {/* Candle sconces on wall */}
        <g transform="translate(150, 30)">
          <rect x="-2" y="0" width="4" height="15" fill="#c4a050" />
          <rect x="-8" y="15" width="16" height="3" fill="#c4a050" />
          <ellipse cx="0" cy="-3" rx="3" ry="6" fill="#f39c12" opacity="0.8" />
        </g>
        <g transform="translate(800, 30)">
          <rect x="-2" y="0" width="4" height="15" fill="#c4a050" />
          <rect x="-8" y="15" width="16" height="3" fill="#c4a050" />
          <ellipse cx="0" cy="-3" rx="3" ry="6" fill="#f39c12" opacity="0.8" />
        </g>
      </svg>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
      <span className="text-gray-600 text-xl">Room: {theme}</span>
    </div>
  );
}
