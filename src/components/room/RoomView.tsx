import { useGameStore } from '../../store/gameStore.ts';
import { useInventoryStore } from '../../store/inventoryStore.ts';
import { useJournalStore } from '../../store/journalStore.ts';
import { useUiStore } from '../../store/uiStore.ts';
import { getRoomById } from '../../data/rooms/index.ts';
import { getItemById } from '../../data/items.ts';
import { getVisibleHotSpots } from '../../engine/roomEngine.ts';
import { HotSpot } from './HotSpot.tsx';
import { ObjectExamine } from './ObjectExamine.tsx';
import { KeyRound, CheckCircle, Search } from 'lucide-react';
import type { HotSpotAction, HotSpot as HotSpotDef } from '../../types/room.ts';

export function RoomView() {
  const currentRoomId = useGameStore((s) => s.currentRoomId);
  const solvedPuzzleIds = useGameStore((s) => s.solvedPuzzleIds);
  const discoveredObjectIds = useGameStore((s) => s.discoveredObjectIds);
  const discoverObject = useGameStore((s) => s.discoverObject);
  const collectedItemIds = useInventoryStore((s) => s.collectedItemIds);
  const usedItemIds = useInventoryStore((s) => s.usedItemIds);
  const pickupItem = useInventoryStore((s) => s.pickupItem);
  const addJournalEntry = useJournalStore((s) => s.addEntry);
  const openExamine = useUiStore((s) => s.openExamine);
  const openPuzzle = useUiStore((s) => s.openPuzzle);
  const showMessage = useUiStore((s) => s.showMessage);

  const room = getRoomById(currentRoomId);

  // Handle hotspot actions — reads inventory state directly from the store
  // to avoid stale closure issues with useCallback
  function handleAction(action: HotSpotAction, hotSpot: HotSpotDef) {
    discoverObject(hotSpot.id);

    switch (action.kind) {
      case 'examine':
        openExamine(hotSpot.id, action.description);
        break;
      case 'pickup': {
        const currentCollected = useInventoryStore.getState().collectedItemIds;
        if (currentCollected.includes(action.itemId)) {
          const item = getItemById(action.itemId);
          showMessage(`You already have the ${item?.name ?? 'item'}.`);
        } else {
          pickupItem(action.itemId);
          const item = getItemById(action.itemId);
          showMessage(`Found: ${item?.name ?? hotSpot.label}!`);
        }
        break;
      }
      case 'open_puzzle':
        openPuzzle(action.puzzleId);
        break;
      case 'use_item': {
        // Read current inventory directly from store — avoids stale closure bug
        const invState = useInventoryStore.getState();
        const hasKey = invState.collectedItemIds.includes(action.requiredItemId)
          && !invState.usedItemIds.includes(action.requiredItemId);
        if (hasKey) {
          useInventoryStore.getState().useItem(action.requiredItemId);
          const item = getItemById(action.requiredItemId);
          showMessage(`Used: ${item?.name ?? 'item'}!`);
          // Small delay so the "Used" message shows before the next action
          setTimeout(() => handleAction(action.resultAction, hotSpot), 600);
        } else if (invState.usedItemIds.includes(action.requiredItemId)) {
          // Item was already used — cabinet is already unlocked, open the puzzle directly
          handleAction(action.resultAction, hotSpot);
        } else {
          showMessage('You need to find something to use here...');
        }
        break;
      }
      case 'show_message':
        showMessage(action.message);
        break;
      case 'add_journal_entry': {
        const journalState = useJournalStore.getState();
        if (journalState.hasEntry(action.entryText)) {
          showMessage('You already noted this clue in your journal.');
        } else {
          addJournalEntry({ text: action.entryText, roomId: currentRoomId });
          showMessage('Added a clue to your journal!');
        }
        break;
      }
    }
  }

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

      {/* Floating indicators for found items / solved puzzles / examined objects */}
      {visibleHotSpots.map((hs) => {
        let indicator: 'key' | 'solved' | 'examined' | null = null;

        if (hs.type === 'pickup' && hs.action.kind === 'pickup' && collectedItemIds.includes(hs.action.itemId)) {
          indicator = 'key';
        } else if (hs.type === 'puzzle' && hs.action.kind === 'open_puzzle' && solvedPuzzleIds.includes(hs.action.puzzleId)) {
          indicator = 'solved';
        } else if (hs.type === 'use_item' && hs.action.kind === 'use_item' && usedItemIds.includes(hs.action.requiredItemId)) {
          indicator = 'solved';
        } else if ((hs.type === 'examine' || hs.action.kind === 'add_journal_entry') && discoveredObjectIds.includes(hs.id)) {
          indicator = 'examined';
        }

        if (!indicator) return null;

        return (
          <div
            key={`indicator-${hs.id}`}
            className="absolute pointer-events-none z-20"
            style={{
              left: `${hs.x + hs.width / 2}%`,
              top: `${hs.y}%`,
              transform: 'translate(-50%, -120%)',
            }}
          >
            {indicator === 'key' && (
              <div className="bg-amber-500 text-gray-900 rounded-full p-1.5 shadow-lg shadow-amber-500/40 animate-bounce">
                <KeyRound size={16} />
              </div>
            )}
            {indicator === 'solved' && (
              <div className="bg-green-500 text-white rounded-full p-1.5 shadow-lg shadow-green-500/40">
                <CheckCircle size={16} />
              </div>
            )}
            {indicator === 'examined' && (
              <div className="bg-blue-500/80 text-white rounded-full p-1 shadow-lg shadow-blue-500/30">
                <Search size={14} />
              </div>
            )}
          </div>
        );
      })}

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

  if (theme === 'arcade') {
    return (
      <svg viewBox="0 0 1000 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        {/* Floor - checkered tile */}
        <rect x="0" y="420" width="1000" height="180" fill="#1a1a2e" />
        {Array.from({ length: 20 }).map((_, i) => (
          <rect key={`floor-${i}`} x={i * 50} y={i % 2 ? 420 : 470} width="50" height="50" fill="#16213e" opacity="0.5" />
        ))}

        {/* Walls - dark with neon accent */}
        <rect x="0" y="0" width="1000" height="420" fill="#0f0f23" />
        <line x1="0" y1="420" x2="1000" y2="420" stroke="#e91e8c" strokeWidth="3" />

        {/* Arcade machine - left */}
        <rect x="100" y="120" width="200" height="300" fill="#1a1a3e" rx="8" />
        <rect x="110" y="130" width="180" height="120" fill="#000" rx="4" />
        <rect x="120" y="140" width="160" height="100" fill="#0a1628" rx="2" />
        {/* Screen glow */}
        <rect x="130" y="150" width="140" height="80" fill="#1a0a3e" rx="2" />
        <text x="200" y="195" textAnchor="middle" fill="#00ff88" fontSize="18" fontFamily="monospace">INSERT COIN</text>
        {/* Joystick */}
        <circle cx="170" cy="310" r="15" fill="#333" />
        <rect x="167" y="280" width="6" height="30" fill="#e91e8c" rx="3" />
        {/* Buttons */}
        <circle cx="230" cy="300" r="12" fill="#ff4444" />
        <circle cx="260" cy="295" r="12" fill="#44ff44" />
        <circle cx="285" cy="300" r="12" fill="#4444ff" />

        {/* Poster on wall */}
        <rect x="320" y="30" width="160" height="150" fill="#2a1a3e" rx="4" />
        <rect x="325" y="35" width="150" height="140" fill="#1a0a2e" rx="2" />
        {/* Arrow symbols on poster */}
        <text x="400" y="70" textAnchor="middle" fill="#00ff88" fontSize="24">DANCE</text>
        <text x="400" y="100" textAnchor="middle" fill="#22cc66" fontSize="20">UP LEFT</text>
        <text x="400" y="125" textAnchor="middle" fill="#22cc66" fontSize="20">RIGHT DOWN</text>
        <text x="400" y="160" textAnchor="middle" fill="#e91e8c" fontSize="14">MOVES!</text>

        {/* Dance pad */}
        <rect x="350" y="330" width="220" height="90" fill="#222" rx="4" />
        <rect x="360" y="340" width="40" height="40" fill="#00ff88" opacity="0.3" rx="2" />
        <rect x="410" y="340" width="40" height="40" fill="#ff4444" opacity="0.3" rx="2" />
        <rect x="460" y="340" width="40" height="40" fill="#4488ff" opacity="0.3" rx="2" />
        <rect x="510" y="340" width="40" height="40" fill="#ffff00" opacity="0.3" rx="2" />

        {/* Jukebox */}
        <rect x="620" y="210" width="150" height="210" fill="#3d1a1a" rx="10" />
        <rect x="630" y="220" width="130" height="80" fill="#1a0a0a" rx="6" />
        <ellipse cx="695" cy="260" rx="50" ry="35" fill="#2a1a3e" />
        <circle cx="695" cy="260" r="20" fill="#333" />
        <circle cx="695" cy="260" r="5" fill="#e91e8c" />
        <rect x="650" y="320" width="90" height="8" fill="#c4a050" rx="2" />
        <rect x="650" y="336" width="90" height="8" fill="#c4a050" rx="2" />
        <rect x="650" y="352" width="90" height="8" fill="#c4a050" rx="2" />
        {/* Token slot */}
        <rect x="680" y="380" width="30" height="5" fill="#c4a050" rx="1" />

        {/* Neon sign */}
        <text x="550" y="25" textAnchor="middle" fill="#e91e8c" fontSize="32" fontFamily="monospace" opacity="0.9">GAME ZONE</text>

        {/* Broken machine - right */}
        <rect x="800" y="300" width="120" height="120" fill="#1a1a2e" rx="6" />
        <rect x="810" y="310" width="100" height="50" fill="#111" rx="3" />
        <text x="860" y="340" textAnchor="middle" fill="#ff4444" fontSize="12">OUT OF ORDER</text>

        {/* Exit gate */}
        <rect x="850" y="60" width="120" height="350" fill="#1a2a1a" rx="4" />
        <rect x="860" y="70" width="100" height="330" fill="#0f1f0f" rx="2" />
        <text x="910" y="250" textAnchor="middle" fill="#00ff88" fontSize="14" opacity="0.5">EXIT</text>

        {/* Gumball machine */}
        <g transform="translate(600, 450)">
          <rect x="-10" y="20" width="20" height="40" fill="#cc3333" rx="2" />
          <circle cx="0" cy="5" r="25" fill="#cc3333" />
          <circle cx="0" cy="5" r="22" fill="#fff" opacity="0.3" />
          <circle cx="-8" cy="0" r="4" fill="#ff6666" />
          <circle cx="5" cy="-5" r="4" fill="#66ff66" />
          <circle cx="8" cy="6" r="4" fill="#6666ff" />
          <circle cx="-4" cy="10" r="4" fill="#ffff66" />
        </g>

        {/* Neon strips on ceiling */}
        <line x1="50" y1="5" x2="300" y2="5" stroke="#e91e8c" strokeWidth="2" opacity="0.6" />
        <line x1="700" y1="5" x2="950" y2="5" stroke="#00ff88" strokeWidth="2" opacity="0.6" />
      </svg>
    );
  }

  if (theme === 'space-station') {
    return (
      <svg viewBox="0 0 1000 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        {/* Metal floor */}
        <rect x="0" y="450" width="1000" height="150" fill="#2a3040" />
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`grid-${i}`} x1={i * 100} y1="450" x2={i * 100} y2="600" stroke="#3a4050" strokeWidth="1" />
        ))}

        {/* Walls - metallic */}
        <rect x="0" y="0" width="1000" height="450" fill="#1a2030" />

        {/* Panel lines */}
        <line x1="0" y1="150" x2="1000" y2="150" stroke="#2a3545" strokeWidth="1" />
        <line x1="0" y1="300" x2="1000" y2="300" stroke="#2a3545" strokeWidth="1" />
        <line x1="250" y1="0" x2="250" y2="450" stroke="#2a3545" strokeWidth="1" />
        <line x1="550" y1="0" x2="550" y2="450" stroke="#2a3545" strokeWidth="1" />
        <line x1="780" y1="0" x2="780" y2="450" stroke="#2a3545" strokeWidth="1" />

        {/* Mission console - left */}
        <rect x="50" y="60" width="250" height="210" fill="#0a1628" rx="8" />
        <rect x="60" y="70" width="230" height="140" fill="#0f1f38" rx="4" />
        {/* Screen content */}
        <rect x="70" y="80" width="210" height="120" fill="#001122" rx="2" />
        <text x="175" y="115" textAnchor="middle" fill="#00aaff" fontSize="12" fontFamily="monospace">MISSION LOG</text>
        <text x="175" y="140" textAnchor="middle" fill="#0088cc" fontSize="10" fontFamily="monospace">AUTHORIZATION REQUIRED</text>
        <text x="175" y="160" textAnchor="middle" fill="#0088cc" fontSize="10" fontFamily="monospace">REF: 2001 PROTOCOL</text>
        {/* Keyboard */}
        <rect x="80" y="220" width="190" height="30" fill="#1a2a3a" rx="2" />

        {/* Airlock panel - left lower */}
        <rect x="50" y="300" width="220" height="150" fill="#1a2535" rx="6" />
        <rect x="60" y="310" width="200" height="80" fill="#0a1520" rx="3" />
        <circle cx="160" cy="350" r="30" fill="none" stroke="#ff3333" strokeWidth="3" />
        <text x="160" y="355" textAnchor="middle" fill="#ff3333" fontSize="14" fontFamily="monospace">LOCK</text>
        <rect x="100" y="400" width="120" height="30" fill="#333" rx="3" />

        {/* Star chart */}
        <rect x="320" y="30" width="200" height="150" fill="#0a0a1a" rx="4" />
        <rect x="325" y="35" width="190" height="140" fill="#050510" rx="2" />
        {/* Stars */}
        <circle cx="350" cy="60" r="3" fill="#4488ff" />
        <circle cx="390" cy="80" r="3" fill="#ff4444" />
        <circle cx="430" cy="70" r="3" fill="#44ff44" />
        <circle cx="460" cy="100" r="3" fill="#00ffff" />
        <circle cx="490" cy="90" r="3" fill="#ffff44" />
        {/* Routes */}
        <line x1="350" y1="60" x2="390" y2="80" stroke="#224488" strokeWidth="1" />
        <line x1="390" y1="80" x2="430" y2="70" stroke="#224488" strokeWidth="1" />
        <line x1="430" y1="70" x2="460" y2="100" stroke="#224488" strokeWidth="1" />
        <line x1="460" y1="100" x2="490" y2="90" stroke="#224488" strokeWidth="1" />
        <text x="420" y="160" textAnchor="middle" fill="#2255aa" fontSize="10" fontFamily="monospace">NAV CHART</text>

        {/* Navigation console - center */}
        <rect x="300" y="210" width="250" height="210" fill="#0f1825" rx="6" />
        <rect x="310" y="220" width="230" height="130" fill="#001122" rx="4" />
        <text x="425" y="280" textAnchor="middle" fill="#00ff88" fontSize="16" fontFamily="monospace">COURSE</text>
        <text x="425" y="300" textAnchor="middle" fill="#008844" fontSize="12" fontFamily="monospace">INPUT REQUIRED</text>
        {/* Buttons */}
        <circle cx="350" cy="380" r="10" fill="#224488" />
        <circle cx="385" cy="380" r="10" fill="#882222" />
        <circle cx="420" cy="380" r="10" fill="#228822" />
        <circle cx="455" cy="380" r="10" fill="#888822" />

        {/* Crew terminal - right center */}
        <rect x="600" y="180" width="180" height="240" fill="#1a2030" rx="6" />
        <rect x="610" y="190" width="160" height="100" fill="#0a1015" rx="3" />
        <text x="690" y="240" textAnchor="middle" fill="#ff8800" fontSize="12" fontFamily="monospace">CREW</text>
        <text x="690" y="260" textAnchor="middle" fill="#aa6600" fontSize="10" fontFamily="monospace">TERMINAL</text>
        <rect x="630" y="310" width="120" height="8" fill="#1a2a3a" rx="1" />
        <rect x="630" y="325" width="120" height="8" fill="#1a2a3a" rx="1" />

        {/* Escape pod - right */}
        <rect x="820" y="120" width="150" height="360" fill="#1a2a35" rx="10" />
        <rect x="830" y="130" width="130" height="200" fill="#0f1a25" rx="6" />
        <circle cx="895" cy="230" r="50" fill="none" stroke="#2a4055" strokeWidth="2" />
        <circle cx="895" cy="230" r="40" fill="#0a1520" />
        {/* Window showing space */}
        <circle cx="895" cy="230" r="35" fill="#000510" />
        <circle cx="880" cy="220" r="2" fill="#ffffff" opacity="0.6" />
        <circle cx="910" cy="240" r="1.5" fill="#ffffff" opacity="0.4" />
        <circle cx="890" cy="210" r="1" fill="#ffffff" opacity="0.5" />
        <text x="895" y="400" textAnchor="middle" fill="#00ff88" fontSize="11" fontFamily="monospace">ESCAPE POD</text>

        {/* Observation window - top right */}
        <rect x="560" y="30" width="200" height="120" fill="#0a0a15" rx="8" />
        {/* Earth */}
        <circle cx="660" cy="90" r="40" fill="#1a4488" />
        <path d="M640 70 Q660 60 680 80 Q670 100 650 90 Z" fill="#22aa44" opacity="0.6" />
        <circle cx="660" cy="90" r="40" fill="none" stroke="#2a3a50" strokeWidth="2" />

        {/* Status lights */}
        <circle cx="30" cy="30" r="5" fill="#ff3333" opacity="0.8" />
        <circle cx="30" cy="50" r="5" fill="#ffaa00" opacity="0.6" />
        <circle cx="30" cy="70" r="5" fill="#00ff88" opacity="0.4" />

        {/* Sleep pod */}
        <rect x="600" y="450" width="150" height="80" fill="#1a2535" rx="8" />
        <rect x="610" y="455" width="130" height="25" fill="#0f1a25" rx="4" />
      </svg>
    );
  }

  if (theme === 'concert-hall') {
    return (
      <svg viewBox="0 0 1000 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        {/* Stage floor */}
        <rect x="0" y="380" width="1000" height="220" fill="#2d1b0e" />
        <rect x="0" y="380" width="1000" height="3" fill="#c4a050" />

        {/* Back wall */}
        <rect x="0" y="0" width="1000" height="380" fill="#2a0a0a" />

        {/* Curtain - left */}
        <path d="M0 0 Q30 100 20 200 Q10 300 30 380 L0 380 Z" fill="#8B0000" opacity="0.8" />
        <path d="M30 0 Q50 80 45 180 Q35 280 50 380 L30 380 Q10 300 20 200 Q30 100 0 0 Z" fill="#6B0000" opacity="0.6" />

        {/* Curtain - right */}
        <rect x="680" y="60" width="150" height="320" fill="#8B0000" rx="4" />
        <path d="M680 60 Q700 150 690 240 Q680 330 700 380 L680 380 Z" fill="#9B1010" opacity="0.7" />
        <path d="M820 60 Q800 150 810 240 Q820 330 800 380 L830 380 L830 60 Z" fill="#6B0000" opacity="0.6" />

        {/* Stage door - far right */}
        <rect x="850" y="90" width="120" height="290" fill="#3d1a0e" rx="4" />
        <rect x="855" y="95" width="110" height="280" fill="#2a120a" rx="2" />
        <circle cx="955" cy="240" r="5" fill="#c4a050" />
        <text x="910" y="245" textAnchor="middle" fill="#c4a050" fontSize="10" opacity="0.5">EXIT</text>

        {/* Sheet music stand - left */}
        <g transform="translate(200, 180)">
          <rect x="-2" y="40" width="4" height="80" fill="#555" />
          <rect x="-20" y="115" width="40" height="5" fill="#555" rx="2" />
          <rect x="-30" y="0" width="60" height="45" fill="#f5f0e0" rx="2" />
          <line x1="-25" y1="10" x2="25" y2="10" stroke="#333" strokeWidth="0.5" />
          <line x1="-25" y1="15" x2="25" y2="15" stroke="#333" strokeWidth="0.5" />
          <line x1="-25" y1="20" x2="25" y2="20" stroke="#333" strokeWidth="0.5" />
          <line x1="-25" y1="25" x2="25" y2="25" stroke="#333" strokeWidth="0.5" />
          <circle cx="-10" cy="12" r="2" fill="#333" />
          <circle cx="5" cy="17" r="2" fill="#333" />
          <circle cx="-5" cy="22" r="2" fill="#333" />
          <circle cx="10" cy="27" r="2" fill="#333" />
        </g>

        {/* Grand piano */}
        <g transform="translate(100, 300)">
          <ellipse cx="100" cy="40" rx="120" ry="60" fill="#111" />
          <rect x="-10" y="40" width="220" height="80" fill="#0a0a0a" rx="4" />
          {/* Keys */}
          <rect x="20" y="45" width="160" height="15" fill="#f5f5f0" rx="1" />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={`key-${i}`} x={24 + i * 13} y="45" width="1" height="15" fill="#333" />
          ))}
          {/* Black keys */}
          <rect x="32" y="45" width="8" height="9" fill="#111" rx="1" />
          <rect x="45" y="45" width="8" height="9" fill="#111" rx="1" />
          <rect x="71" y="45" width="8" height="9" fill="#111" rx="1" />
          <rect x="84" y="45" width="8" height="9" fill="#111" rx="1" />
          <rect x="97" y="45" width="8" height="9" fill="#111" rx="1" />
          {/* Legs */}
          <rect x="5" y="95" width="8" height="25" fill="#111" />
          <rect x="190" y="95" width="8" height="25" fill="#111" />
        </g>

        {/* VIP seats - center audience */}
        <g transform="translate(380, 410)">
          {/* Purple seat */}
          <rect x="0" y="0" width="40" height="30" fill="#8B008B" rx="4" />
          {/* Blue seat */}
          <rect x="50" y="0" width="40" height="30" fill="#2244aa" rx="4" />
          {/* Red seat */}
          <rect x="100" y="0" width="40" height="30" fill="#cc2222" rx="4" />
          {/* Yellow seat */}
          <rect x="150" y="0" width="40" height="30" fill="#ccaa22" rx="4" />
          {/* Green seat */}
          <rect x="200" y="0" width="40" height="30" fill="#22aa22" rx="4" />
          <text x="120" y="55" textAnchor="middle" fill="#c4a050" fontSize="9" opacity="0.6">VIP ROW</text>
        </g>

        {/* Spotlights - top */}
        <g transform="translate(350, 10)">
          <rect x="0" y="0" width="300" height="30" fill="#1a0a0a" rx="4" />
          {/* Light cans */}
          <circle cx="50" cy="30" r="15" fill="#333" />
          <circle cx="50" cy="30" r="10" fill="#8B008B" opacity="0.4" />
          <circle cx="120" cy="30" r="15" fill="#333" />
          <circle cx="120" cy="30" r="10" fill="#2244aa" opacity="0.4" />
          <circle cx="190" cy="30" r="15" fill="#333" />
          <circle cx="190" cy="30" r="10" fill="#cc2222" opacity="0.4" />
          <circle cx="260" cy="30" r="15" fill="#333" />
          <circle cx="260" cy="30" r="10" fill="#ccaa22" opacity="0.4" />
        </g>

        {/* Light beams */}
        <path d="M400 55 L350 380 L450 380 Z" fill="#8B008B" opacity="0.03" />
        <path d="M470 55 L420 380 L520 380 Z" fill="#2244aa" opacity="0.03" />
        <path d="M540 55 L490 380 L590 380 Z" fill="#cc2222" opacity="0.03" />

        {/* Chandelier */}
        <g transform="translate(500, 0)">
          <rect x="-2" y="0" width="4" height="20" fill="#c4a050" />
          <ellipse cx="0" cy="30" rx="40" ry="15" fill="none" stroke="#c4a050" strokeWidth="1.5" />
          <ellipse cx="0" cy="35" rx="30" ry="10" fill="none" stroke="#c4a050" strokeWidth="1" />
          <circle cx="-20" cy="30" r="3" fill="#f4d03f" opacity="0.6" />
          <circle cx="20" cy="30" r="3" fill="#f4d03f" opacity="0.6" />
          <circle cx="0" cy="25" r="3" fill="#f4d03f" opacity="0.6" />
          <circle cx="-10" cy="35" r="2" fill="#f4d03f" opacity="0.4" />
          <circle cx="10" cy="35" r="2" fill="#f4d03f" opacity="0.4" />
        </g>

        {/* Violin case */}
        <g transform="translate(420, 280)">
          <ellipse cx="0" cy="0" rx="40" ry="15" fill="#3d2b1f" />
          <ellipse cx="0" cy="-2" rx="35" ry="12" fill="#2d1b0e" />
          <rect x="-30" y="-3" width="60" height="6" fill="#4a3020" rx="2" />
        </g>

        {/* Old program on floor */}
        <rect x="650" y="480" width="50" height="35" fill="#f5f0e0" rx="2" />
        <line x1="660" y1="490" x2="690" y2="490" stroke="#999" strokeWidth="0.5" />
        <line x1="660" y1="495" x2="690" y2="495" stroke="#999" strokeWidth="0.5" />
        <line x1="660" y1="500" x2="680" y2="500" stroke="#999" strokeWidth="0.5" />

        {/* Music stand (empty) */}
        <g transform="translate(280, 250)">
          <rect x="-1" y="20" width="2" height="50" fill="#555" />
          <rect x="-12" y="65" width="24" height="3" fill="#555" rx="1" />
          <rect x="-18" y="0" width="36" height="22" fill="#444" rx="2" />
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
