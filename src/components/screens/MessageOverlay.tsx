import { useEffect } from 'react';
import { useUiStore } from '../../store/uiStore.ts';

export function MessageOverlay() {
  const activeMessage = useUiStore((s) => s.activeMessage);
  const closeMessage = useUiStore((s) => s.closeMessage);

  useEffect(() => {
    if (activeMessage) {
      const timer = setTimeout(closeMessage, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeMessage, closeMessage]);

  if (!activeMessage) return null;

  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center pb-20 pointer-events-none"
    >
      <div
        className="bg-gray-800/95 border border-amber-400/30 rounded-xl px-6 py-4 max-w-md text-center shadow-2xl pointer-events-auto cursor-pointer animate-[fadeInUp_0.3s_ease-out]"
        onClick={closeMessage}
      >
        <p className="text-gray-200">{activeMessage}</p>
      </div>
    </div>
  );
}
