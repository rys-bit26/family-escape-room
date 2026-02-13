import { Outlet } from 'react-router';
import { GameHeader } from './components/layout/GameHeader.tsx';
import { JournalPanel } from './components/journal/JournalPanel.tsx';
import { useUiStore } from './store/uiStore.ts';
import { useGameStore } from './store/gameStore.ts';

function App() {
  const journalOpen = useUiStore((s) => s.journalOpen);
  const status = useGameStore((s) => s.status);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {status === 'in_progress' && <GameHeader />}
      <main className="flex-1 relative overflow-hidden">
        <Outlet />
        {journalOpen && <JournalPanel />}
      </main>
    </div>
  );
}

export default App;
